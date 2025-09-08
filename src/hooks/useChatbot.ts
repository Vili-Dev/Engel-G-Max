/**
 * Custom hook for G-Maxing Chatbot functionality
 * Manages chat state, context, and integration with NLP processor
 */

import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import GMaxingNLPProcessor from '../utils/chatbot/nlpProcessor';
import { UserContext } from '../utils/chatbot/knowledgeBase';
import { useAuth } from './useAuth';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  confidence?: number;
  suggestedFollowUps?: string[];
  intent?: string;
  entities?: Array<{
    type: string;
    value: string;
    confidence: number;
  }>;
}

interface ChatbotState {
  isOpen: boolean;
  isTyping: boolean;
  messages: ChatMessage[];
  context: UserContext;
  processor: GMaxingNLPProcessor;
  sessionId: string;
}

interface ChatbotMetrics {
  totalMessages: number;
  averageConfidence: number;
  intentDistribution: Record<string, number>;
  sessionDuration: number;
  responseTime: number[];
  userSatisfaction: number;
}

interface UseChatbotReturn {
  // State
  isOpen: boolean;
  isTyping: boolean;
  messages: ChatMessage[];
  context: UserContext;
  
  // Actions
  toggle: () => void;
  sendMessage: (text: string) => Promise<ChatMessage | null>;
  clearChat: () => void;
  loadChatHistory: () => void;
  saveChatHistory: () => void;
  
  // Analytics
  metrics: ChatbotMetrics;
  processingStats: any;
  
  // State queries
  hasMessages: boolean;
  lastBotMessage: ChatMessage | null;
  canSendMessage: boolean;
}

export const useChatbot = (initialContext: UserContext = {}): UseChatbotReturn => {
  const { user } = useAuth();
  const sessionStartTime = useRef<Date>(new Date());
  const responseStartTime = useRef<Date | null>(null);

  const [state, setState] = useState<ChatbotState>(() => ({
    isOpen: false,
    isTyping: false,
    messages: [],
    context: {
      ...initialContext,
      userName: user?.displayName || undefined,
      userId: user?.uid || undefined,
      sessionId: `gmax-chat-${Date.now()}`,
      startTime: new Date(),
      engagementLevel: 'low'
    },
    processor: new GMaxingNLPProcessor(),
    sessionId: `gmax-chat-${Date.now()}`
  }));

  const [responseTimeHistory, setResponseTimeHistory] = useState<number[]>([]);

  // Load chat history on mount if user is authenticated
  useEffect(() => {
    if (user) {
      loadChatHistory();
    }
  }, [user]);

  // Save chat history when messages change
  useEffect(() => {
    if (user && state.messages.length > 0) {
      const saveTimer = setTimeout(() => {
        saveChatHistory();
      }, 2000); // Debounce saves
      
      return () => clearTimeout(saveTimer);
    }
  }, [state.messages, user]);

  // Auto-save context changes
  useEffect(() => {
    if (user && state.context.conversationHistory?.length) {
      const contextTimer = setTimeout(() => {
        localStorage.setItem(`gmax-chat-context-${user.uid}`, JSON.stringify(state.context));
      }, 1000);
      
      return () => clearTimeout(contextTimer);
    }
  }, [state.context, user]);

  /**
   * Toggle chat window
   */
  const toggle = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: !prev.isOpen }));
  }, []);

  /**
   * Send message and get bot response
   */
  const sendMessage = useCallback(async (text: string): Promise<ChatMessage | null> => {
    if (!text.trim() || state.isTyping) return null;

    responseStartTime.current = new Date();

    // Add user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      text: text.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isTyping: true
    }));

    try {
      console.log('🤖 Processing user message:', text);

      // Process with NLP
      const result = await state.processor.processQuery(text, state.context);
      
      // Calculate response time
      const responseTime = responseStartTime.current 
        ? Date.now() - responseStartTime.current.getTime()
        : 0;
      
      setResponseTimeHistory(prev => [...prev.slice(-9), responseTime]); // Keep last 10

      // Simulate realistic typing delay based on response length
      const typingDelay = Math.min(3000, Math.max(1000, result.response.text.length * 20));
      await new Promise(resolve => setTimeout(resolve, typingDelay));

      // Create bot message
      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        text: result.response.text,
        sender: 'bot',
        timestamp: new Date(),
        confidence: result.response.confidence,
        suggestedFollowUps: result.response.suggestedFollowUps,
        intent: result.intent?.id,
        entities: result.entities
      };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, botMessage],
        context: result.context,
        isTyping: false
      }));

      console.log('✅ Bot response generated successfully');
      return botMessage;

    } catch (error) {
      console.error('❌ Error processing message:', error);

      // Error fallback
      const errorMessage: ChatMessage = {
        id: `bot-error-${Date.now()}`,
        text: 'Disculpa, he tenido un problema procesando tu pregunta. ¿Podrías intentarlo de nuevo?',
        sender: 'bot',
        timestamp: new Date(),
        confidence: 0.1
      };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, errorMessage],
        isTyping: false
      }));

      return errorMessage;
    }
  }, [state.processor, state.context, state.isTyping]);

  /**
   * Clear chat history
   */
  const clearChat = useCallback(() => {
    setState(prev => ({
      ...prev,
      messages: [],
      context: {
        ...initialContext,
        userName: user?.displayName || undefined,
        userId: user?.uid || undefined,
        sessionId: `gmax-chat-${Date.now()}`,
        startTime: new Date(),
        engagementLevel: 'low'
      },
      sessionId: `gmax-chat-${Date.now()}`
    }));

    // Clear saved history
    if (user) {
      localStorage.removeItem(`gmax-chat-history-${user.uid}`);
      localStorage.removeItem(`gmax-chat-context-${user.uid}`);
    }

    sessionStartTime.current = new Date();
    setResponseTimeHistory([]);
    console.log('🧹 Chat history cleared');
  }, [user, initialContext]);

  /**
   * Load chat history from localStorage
   */
  const loadChatHistory = useCallback(() => {
    if (!user) return;

    try {
      // Load messages
      const savedMessages = localStorage.getItem(`gmax-chat-history-${user.uid}`);
      const savedContext = localStorage.getItem(`gmax-chat-context-${user.uid}`);

      if (savedMessages) {
        const messages = JSON.parse(savedMessages);
        // Convert timestamp strings back to Date objects
        const parsedMessages = messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));

        setState(prev => ({
          ...prev,
          messages: parsedMessages
        }));
      }

      if (savedContext) {
        const context = JSON.parse(savedContext);
        setState(prev => ({
          ...prev,
          context: {
            ...context,
            startTime: context.startTime ? new Date(context.startTime) : new Date()
          }
        }));
      }

      console.log('📱 Chat history loaded successfully');
    } catch (error) {
      console.warn('⚠️ Failed to load chat history:', error);
    }
  }, [user]);

  /**
   * Save chat history to localStorage
   */
  const saveChatHistory = useCallback(() => {
    if (!user || state.messages.length === 0) return;

    try {
      // Save last 50 messages to prevent localStorage bloat
      const messagesToSave = state.messages.slice(-50);
      localStorage.setItem(`gmax-chat-history-${user.uid}`, JSON.stringify(messagesToSave));
      console.log('💾 Chat history saved');
    } catch (error) {
      console.warn('⚠️ Failed to save chat history:', error);
    }
  }, [user, state.messages]);

  /**
   * Calculate chat metrics
   */
  const metrics = useMemo((): ChatbotMetrics => {
    const botMessages = state.messages.filter(m => m.sender === 'bot' && m.confidence);
    const totalConfidence = botMessages.reduce((sum, msg) => sum + (msg.confidence || 0), 0);
    
    const intentDistribution = state.messages
      .filter(m => m.intent)
      .reduce((acc, msg) => {
        if (msg.intent) {
          acc[msg.intent] = (acc[msg.intent] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);

    const sessionDuration = Date.now() - sessionStartTime.current.getTime();
    const avgResponseTime = responseTimeHistory.length > 0
      ? responseTimeHistory.reduce((sum, time) => sum + time, 0) / responseTimeHistory.length
      : 0;

    // Calculate user satisfaction based on engagement and response quality
    const userSatisfaction = Math.min(100, Math.max(0, 
      (botMessages.length > 0 ? (totalConfidence / botMessages.length) * 100 : 0) +
      (state.context.engagementLevel === 'high' ? 20 : 0) +
      (avgResponseTime < 2000 ? 10 : 0) - 
      (avgResponseTime > 5000 ? 10 : 0)
    ));

    return {
      totalMessages: state.messages.length,
      averageConfidence: botMessages.length > 0 ? totalConfidence / botMessages.length : 0,
      intentDistribution,
      sessionDuration,
      responseTime: responseTimeHistory,
      userSatisfaction: Math.round(userSatisfaction)
    };
  }, [state.messages, state.context.engagementLevel, responseTimeHistory]);

  /**
   * Get processing statistics
   */
  const processingStats = useMemo(() => {
    return state.processor.getProcessingStats();
  }, [state.processor]);

  /**
   * Check if there are messages
   */
  const hasMessages = useMemo(() => state.messages.length > 0, [state.messages.length]);

  /**
   * Get last bot message
   */
  const lastBotMessage = useMemo(() => {
    const botMessages = state.messages.filter(m => m.sender === 'bot');
    return botMessages.length > 0 ? botMessages[botMessages.length - 1] : null;
  }, [state.messages]);

  /**
   * Check if can send message
   */
  const canSendMessage = useMemo(() => !state.isTyping, [state.isTyping]);

  return {
    // State
    isOpen: state.isOpen,
    isTyping: state.isTyping,
    messages: state.messages,
    context: state.context,
    
    // Actions
    toggle,
    sendMessage,
    clearChat,
    loadChatHistory,
    saveChatHistory,
    
    // Analytics
    metrics,
    processingStats,
    
    // State queries
    hasMessages,
    lastBotMessage,
    canSendMessage
  };
};

export default useChatbot;
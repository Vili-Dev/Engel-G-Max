/**
 * G-Maxing Intelligent Chatbot Interface
 * Advanced AI-powered chat component with glassmorphism design
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  ChatBubbleLeftRightIcon,
  XMarkIcon,
  PaperAirplaneIcon,
  SparklesIcon,
  UserIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline';
import GMaxingNLPProcessor from '../../utils/chatbot/nlpProcessor';
import { UserContext } from '../../utils/chatbot/knowledgeBase';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  confidence?: number;
  suggestedFollowUps?: string[];
}

interface ChatInterfaceProps {
  isOpen: boolean;
  onToggle: () => void;
  userContext?: UserContext;
  className?: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  isOpen,
  onToggle,
  userContext = {},
  className = ''
}) => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [processor] = useState(() => new GMaxingNLPProcessor());
  const [context, setContext] = useState<UserContext>(userContext);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Initialize chat with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        text: `🏋️‍♂️ ¡Hola! Soy el asistente inteligente de G-Maxing. Estoy aquí para ayudarte con la metodología de Engel Garcia Gomez, entrenamientos, nutrición y cualquier pregunta sobre fitness.

¿En qué puedo ayudarte hoy?`,
        sender: 'bot',
        timestamp: new Date(),
        confidence: 1,
        suggestedFollowUps: [
          "¿Qué es G-Maxing?",
          "Necesito un plan de entrenamiento",
          "Consejos de nutrición",
          "¿Quién es Engel Garcia Gomez?"
        ]
      };
      setMessages([welcomeMessage]);
    }
  }, []);

  const handleSendMessage = useCallback(async (messageText?: string) => {
    const text = messageText || inputText.trim();
    if (!text) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      // Process with NLP
      const result = await processor.processQuery(text, context);
      
      // Update context
      setContext(result.context);

      // Simulate typing delay
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

      // Add bot response
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: result.response.text,
        sender: 'bot',
        timestamp: new Date(),
        confidence: result.response.confidence,
        suggestedFollowUps: result.response.suggestedFollowUps
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('❌ Chat processing error:', error);
      
      // Error fallback message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Disculpa, he tenido un problema procesando tu pregunta. ¿Podrías intentarlo de nuevo?',
        sender: 'bot',
        timestamp: new Date(),
        confidence: 0.1
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  }, [inputText, context, processor]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestedFollowUp = (followUp: string) => {
    handleSendMessage(followUp);
  };

  const clearChat = () => {
    setMessages([]);
    setContext({});
  };

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      {/* Chat Toggle Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggle}
            className="group relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white p-4 rounded-full shadow-2xl hover:shadow-blue-500/25 transition-all duration-300"
          >
            {/* Animated background */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300" />
            
            {/* Icon */}
            <div className="relative flex items-center justify-center">
              <ChatBubbleLeftRightIcon className="h-6 w-6" />
              <SparklesIcon className="h-3 w-3 absolute -top-1 -right-1 text-yellow-300 animate-pulse" />
            </div>

            {/* Notification badge */}
            {messages.length === 0 && (
              <div className="absolute -top-1 -left-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-bounce">
                !
              </div>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl w-96 h-[600px] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 p-4 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-full">
                      <CpuChipIcon className="h-5 w-5 text-white" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-green-500 h-3 w-3 rounded-full border-2 border-white animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm">G-Maxing AI</h3>
                    <p className="text-white/70 text-xs">Asistente Inteligente</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={clearChat}
                    className="text-white/60 hover:text-white/90 transition-colors p-1"
                    title="Limpiar chat"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                  
                  <button
                    onClick={onToggle}
                    className="text-white/60 hover:text-white/90 transition-colors p-1"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                      {/* Message bubble */}
                      <div
                        className={`rounded-2xl px-4 py-2 ${
                          message.sender === 'user'
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                            : 'bg-white/10 backdrop-blur-sm border border-white/20 text-white'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                        
                        {/* Confidence indicator for bot messages */}
                        {message.sender === 'bot' && message.confidence && (
                          <div className="mt-2 flex items-center space-x-1">
                            <div className="flex space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <div
                                  key={i}
                                  className={`h-1 w-3 rounded-full ${
                                    i < Math.floor(message.confidence! * 5)
                                      ? 'bg-green-400'
                                      : 'bg-white/20'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-white/60">
                              {Math.round(message.confidence * 100)}% confident
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Avatar */}
                      <div className={`mt-2 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`h-6 w-6 rounded-full flex items-center justify-center ${
                          message.sender === 'user'
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                            : 'bg-gradient-to-r from-purple-500 to-pink-500'
                        }`}>
                          {message.sender === 'user' ? (
                            <UserIcon className="h-3 w-3 text-white" />
                          ) : (
                            <CpuChipIcon className="h-3 w-3 text-white" />
                          )}
                        </div>
                      </div>

                      {/* Suggested follow-ups */}
                      {message.sender === 'bot' && message.suggestedFollowUps && message.suggestedFollowUps.length > 0 && (
                        <div className="mt-3 space-y-1">
                          <p className="text-xs text-white/60">Preguntas sugeridas:</p>
                          {message.suggestedFollowUps.map((followUp, index) => (
                            <motion.button
                              key={index}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleSuggestedFollowUp(followUp)}
                              className="block w-full text-left text-xs bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg px-2 py-1 text-white/80 hover:text-white transition-all duration-200"
                            >
                              {followUp}
                            </motion.button>
                          ))}
                        </div>
                      )}

                      {/* Timestamp */}
                      <div className={`mt-1 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <span className="text-xs text-white/40">
                          {message.timestamp.toLocaleTimeString('es-ES', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-4 py-2 max-w-[80%]">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-white/10 p-4">
              <div className="flex items-center space-x-2">
                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Escribe tu pregunta sobre G-Maxing..."
                    disabled={isTyping}
                    className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent disabled:opacity-50"
                  />
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSendMessage()}
                  disabled={!inputText.trim() || isTyping}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-2 rounded-xl shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <PaperAirplaneIcon className="h-5 w-5" />
                </motion.button>
              </div>
              
              {/* Quick actions */}
              <div className="mt-2 flex flex-wrap gap-1">
                {['¿Qué es G-Maxing?', 'Plan de entrenamiento', 'Consejos nutricionales'].map((action) => (
                  <button
                    key={action}
                    onClick={() => handleSendMessage(action)}
                    disabled={isTyping}
                    className="text-xs bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg px-2 py-1 text-white/70 hover:text-white disabled:opacity-50 transition-all duration-200"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatInterface;
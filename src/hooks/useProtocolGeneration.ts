import { useState, useCallback, useEffect, useMemo } from 'react';
import { 
  gMaxingProtocolGenerator,
  GeneratedProtocol,
  WorkoutTemplate
} from '../utils/protocols/protocolGenerator';
import { gMaxingTemplateLibrary } from '../utils/protocols/templateLibrary';
import { User } from '../types';
import { UserDataService } from '../services/firebase/userData';

interface ProtocolGenerationParams {
  userId: string;
  goals: string[];
  experience: string;
  equipment: string[];
  timeAvailable: number;
  frequency: number;
  duration: number;
  bodyWeight: number;
  age: number;
  preferences: string[];
  limitations: string[];
}

interface UseProtocolGenerationState {
  isGenerating: boolean;
  generatedProtocol: GeneratedProtocol | null;
  availableTemplates: WorkoutTemplate[];
  error: string | null;
  lastGenerated: Date | null;
}

export const useProtocolGeneration = (user: User | null) => {
  const [state, setState] = useState<UseProtocolGenerationState>({
    isGenerating: false,
    generatedProtocol: null,
    availableTemplates: [],
    error: null,
    lastGenerated: null
  });

  const [savedProtocols, setSavedProtocols] = useState<GeneratedProtocol[]>([]);

  // Load available templates on mount
  useEffect(() => {
    const templates = gMaxingTemplateLibrary.getTemplates();
    setState(prev => ({ ...prev, availableTemplates: templates }));
  }, []);

  // Load saved protocols from Firestore
  useEffect(() => {
    if (user) {
      loadSavedProtocols();
    }
  }, [user]);

  const loadSavedProtocols = useCallback(async () => {
    if (!user) return;

    try {
      // Migrate from localStorage first
      await UserDataService.migrateFromLocalStorage(user.uid || user.id);
      
      // Load from Firestore
      const userData = await UserDataService.getUserData(user.uid || user.id);
      if (userData && userData.protocols) {
        const protocols = userData.protocols.map(protocol => ({
          ...protocol,
          userId: user.uid || user.id,
          createdAt: protocol.createdAt,
          lastModified: protocol.updatedAt || protocol.createdAt
        }));
        setSavedProtocols(protocols as GeneratedProtocol[]);
        console.log('🔥 Loaded protocols from Firestore:', protocols.length);
      }
    } catch (error) {
      console.warn('Failed to load saved protocols from Firestore:', error);
    }
  }, [user]);

  // Save protocols to Firestore
  const saveProtocolsToStorage = useCallback(async (protocols: GeneratedProtocol[]) => {
    if (!user) return;

    try {
      const userProtocols = protocols.map(protocol => ({
        id: protocol.id,
        name: protocol.name,
        type: protocol.type,
        content: protocol,
        createdAt: protocol.createdAt || new Date(),
        updatedAt: protocol.lastModified || new Date(),
        isActive: true
      }));
      
      await UserDataService.updateUserProtocols(user.uid || user.id, userProtocols);
      console.log('💾 Saved protocols to Firestore:', userProtocols.length);
    } catch (error) {
      console.warn('Failed to save protocols to Firestore:', error);
    }
  }, [user]);

  /**
   * Generate a new G-Maxing protocol
   */
  const generateProtocol = useCallback(async (params: Partial<ProtocolGenerationParams>) => {
    if (!user) {
      setState(prev => ({ ...prev, error: 'User must be logged in to generate protocols' }));
      return null;
    }

    setState(prev => ({ ...prev, isGenerating: true, error: null }));

    try {
      console.log('🏗️ Generating G-Maxing protocol...');

      // Build complete parameters from user profile and provided params
      const fullParams: ProtocolGenerationParams = {
        userId: user.id,
        goals: params.goals || user.profile?.goals || ['muscle-gain'],
        experience: params.experience || user.profile?.fitnessLevel || 'intermediate',
        equipment: params.equipment || user.profile?.equipment || ['dumbbells', 'barbell'],
        timeAvailable: params.timeAvailable || user.profile?.availableTime || 60,
        frequency: params.frequency || user.profile?.frequency || 3,
        duration: params.duration || 8,
        bodyWeight: params.bodyWeight || user.profile?.weight || 75,
        age: params.age || user.profile?.age || 30,
        preferences: params.preferences || user.profile?.preferences || [],
        limitations: params.limitations || user.profile?.medicalConditions || []
      };

      // Add small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 1500));

      const protocol = gMaxingProtocolGenerator.generateProtocol(fullParams);

      setState(prev => ({
        ...prev,
        isGenerating: false,
        generatedProtocol: protocol,
        lastGenerated: new Date()
      }));

      console.log('✅ Protocol generated successfully:', protocol.name);
      return protocol;

    } catch (error) {
      console.error('❌ Protocol generation failed:', error);
      setState(prev => ({
        ...prev,
        isGenerating: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }));
      return null;
    }
  }, [user]);

  /**
   * Save the current protocol
   */
  const saveProtocol = useCallback((protocol: GeneratedProtocol) => {
    if (!user) return false;

    const updatedProtocols = [...savedProtocols, protocol];
    setSavedProtocols(updatedProtocols);
    saveProtocolsToStorage(updatedProtocols);

    console.log('💾 Protocol saved:', protocol.name);
    return true;
  }, [user, savedProtocols, saveProtocolsToStorage]);

  /**
   * Delete a saved protocol
   */
  const deleteProtocol = useCallback((protocolId: string) => {
    const updatedProtocols = savedProtocols.filter(p => p.id !== protocolId);
    setSavedProtocols(updatedProtocols);
    saveProtocolsToStorage(updatedProtocols);

    console.log('🗑️ Protocol deleted:', protocolId);
  }, [savedProtocols, saveProtocolsToStorage]);

  /**
   * Generate protocol from specific template
   */
  const generateFromTemplate = useCallback(async (
    templateId: string, 
    customParams?: Partial<ProtocolGenerationParams>
  ) => {
    const template = gMaxingTemplateLibrary.getTemplateById(templateId);
    if (!template) {
      setState(prev => ({ ...prev, error: 'Template not found' }));
      return null;
    }

    // Use template's target goals if not specified
    const params = {
      ...customParams,
      goals: customParams?.goals || template.targetGoals,
      timeAvailable: customParams?.timeAvailable || template.duration
    };

    return generateProtocol(params);
  }, [generateProtocol]);

  /**
   * Get templates filtered by user profile
   */
  const getRecommendedTemplates = useCallback((): WorkoutTemplate[] => {
    if (!user?.profile) return state.availableTemplates;

    const userGoals = user.profile.goals || [];
    const userTime = user.profile.availableTime || 60;
    const userExperience = user.profile.fitnessLevel || 'intermediate';

    return state.availableTemplates
      .filter(template => {
        // Goal alignment
        const hasMatchingGoal = template.targetGoals.some(goal => userGoals.includes(goal));
        
        // Time compatibility (within 20 minutes)
        const timeCompatible = Math.abs(template.duration - userTime) <= 20;
        
        // Experience appropriate
        const experienceMap = { beginner: 1, intermediate: 2, advanced: 3, expert: 4 };
        const userLevel = experienceMap[userExperience as keyof typeof experienceMap] || 2;
        const templateComplexity = template.exerciseSlots.primary + template.exerciseSlots.secondary;
        const experienceAppropriate = Math.abs(userLevel - templateComplexity / 2) <= 1.5;

        return hasMatchingGoal && timeCompatible && experienceAppropriate;
      })
      .sort((a, b) => {
        // Sort by goal match count
        const aGoalMatch = a.targetGoals.filter(goal => userGoals.includes(goal)).length;
        const bGoalMatch = b.targetGoals.filter(goal => userGoals.includes(goal)).length;
        return bGoalMatch - aGoalMatch;
      });
  }, [user, state.availableTemplates]);

  /**
   * Quick protocol generation with smart defaults
   */
  const generateQuickProtocol = useCallback(async (goal: string) => {
    if (!user) return null;

    const quickParams: Partial<ProtocolGenerationParams> = {
      goals: [goal],
      duration: 8, // 8 weeks default
      frequency: 3 // 3x per week default
    };

    return generateProtocol(quickParams);
  }, [user, generateProtocol]);

  /**
   * Validate protocol parameters
   */
  const validateParams = useCallback((params: Partial<ProtocolGenerationParams>): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } => {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (params.goals && params.goals.length === 0) {
      errors.push('At least one goal must be selected');
    }

    if (params.frequency && (params.frequency < 1 || params.frequency > 7)) {
      errors.push('Frequency must be between 1 and 7 sessions per week');
    }

    if (params.duration && (params.duration < 2 || params.duration > 52)) {
      errors.push('Duration must be between 2 and 52 weeks');
    }

    if (params.timeAvailable && params.timeAvailable < 20) {
      warnings.push('Less than 20 minutes may limit exercise selection');
    }

    if (params.timeAvailable && params.timeAvailable > 150) {
      warnings.push('Sessions longer than 2.5 hours may impact recovery');
    }

    if (params.frequency && params.frequency > 5) {
      warnings.push('High frequency (>5x/week) requires careful recovery management');
    }

    if (params.bodyWeight && (params.bodyWeight < 40 || params.bodyWeight > 200)) {
      warnings.push('Body weight seems unusual - please verify');
    }

    if (params.age && (params.age < 16 || params.age > 80)) {
      warnings.push('Age-specific considerations may apply');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }, []);

  /**
   * Get protocol generation statistics
   */
  const getGenerationStats = useMemo(() => {
    const templateStats = gMaxingTemplateLibrary.getTemplateStats();
    
    return {
      ...templateStats,
      savedProtocols: savedProtocols.length,
      lastGenerated: state.lastGenerated,
      hasCurrentProtocol: !!state.generatedProtocol
    };
  }, [savedProtocols, state.lastGenerated, state.generatedProtocol]);

  /**
   * Export protocol data
   */
  const exportProtocol = useCallback((protocol: GeneratedProtocol, format: 'json' | 'pdf' = 'json') => {
    if (format === 'json') {
      const dataStr = JSON.stringify(protocol, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `${protocol.name.replace(/\s+/g, '_')}.json`;
      link.click();
      
      URL.revokeObjectURL(url);
    }
    // PDF export would require additional library
  }, []);

  /**
   * Reset generation state
   */
  const resetGeneration = useCallback(() => {
    setState(prev => ({
      ...prev,
      generatedProtocol: null,
      error: null,
      lastGenerated: null
    }));
  }, []);

  return {
    // State
    isGenerating: state.isGenerating,
    generatedProtocol: state.generatedProtocol,
    availableTemplates: state.availableTemplates,
    savedProtocols,
    error: state.error,
    lastGenerated: state.lastGenerated,
    
    // Template utilities
    recommendedTemplates: getRecommendedTemplates(),
    templateStats: getGenerationStats,
    
    // Actions
    generateProtocol,
    generateFromTemplate,
    generateQuickProtocol,
    saveProtocol,
    deleteProtocol,
    exportProtocol,
    resetGeneration,
    
    // Validation
    validateParams,
    
    // Computed
    hasProtocols: savedProtocols.length > 0,
    canGenerate: !!user && !state.isGenerating,
  };
};

/**
 * Hook for template browsing and selection
 */
export const useTemplateSelection = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<WorkoutTemplate | null>(null);
  const [filterCriteria, setFilterCriteria] = useState({
    category: '',
    goal: '',
    duration: { min: 0, max: 180 },
    intensity: ''
  });

  const templates = gMaxingTemplateLibrary.getTemplates();

  const filteredTemplates = useMemo(() => {
    return templates.filter(template => {
      if (filterCriteria.category && template.category !== filterCriteria.category) {
        return false;
      }
      
      if (filterCriteria.goal && !template.targetGoals.includes(filterCriteria.goal)) {
        return false;
      }
      
      if (template.duration < filterCriteria.duration.min || 
          template.duration > filterCriteria.duration.max) {
        return false;
      }
      
      if (filterCriteria.intensity && template.intensity !== filterCriteria.intensity) {
        return false;
      }
      
      return true;
    });
  }, [templates, filterCriteria]);

  const selectTemplate = useCallback((templateId: string) => {
    const template = gMaxingTemplateLibrary.getTemplateById(templateId);
    setSelectedTemplate(template);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedTemplate(null);
  }, []);

  const updateFilter = useCallback((newCriteria: Partial<typeof filterCriteria>) => {
    setFilterCriteria(prev => ({ ...prev, ...newCriteria }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilterCriteria({
      category: '',
      goal: '',
      duration: { min: 0, max: 180 },
      intensity: ''
    });
  }, []);

  return {
    templates,
    filteredTemplates,
    selectedTemplate,
    filterCriteria,
    selectTemplate,
    clearSelection,
    updateFilter,
    clearFilters,
    hasSelection: !!selectedTemplate,
    resultsCount: filteredTemplates.length
  };
};
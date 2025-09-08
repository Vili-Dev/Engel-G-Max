import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CogIcon,
  ClockIcon,
  CalendarDaysIcon,
  ScaleIcon,
  TrophyIcon,
  FireIcon,
  BoltIcon,
  HeartIcon,
  CheckCircleIcon,
  XCircleIcon,
  DocumentTextIcon,
  ArrowRightIcon,
  StarIcon,
  PlayIcon,
  BookmarkIcon,
  ShareIcon,
  DownloadIcon
} from '@heroicons/react/24/outline';

// Components
import { Button } from '../ui/Button';
import { GlassCard } from '../ui/GlassCard';
import { Badge } from '../ui/Badge';
import LoadingSpinner from '../common/LoadingSpinner';

// Hooks
import { useProtocolGeneration, useTemplateSelection } from '../../hooks/useProtocolGeneration';
import { useTranslation } from '../../hooks/useTranslation';

// Types
import { User } from '../../types';
import { GeneratedProtocol, WorkoutTemplate } from '../../utils/protocols/protocolGenerator';

interface ProtocolGeneratorProps {
  user: User | null;
  onProtocolGenerated?: (protocol: GeneratedProtocol) => void;
}

interface GenerationFormData {
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

const goalOptions = [
  { id: 'strength', label: 'Force', icon: <TrophyIcon className="h-5 w-5" />, color: 'bg-red-500' },
  { id: 'muscle-gain', label: 'Prise de Masse', icon: <FireIcon className="h-5 w-5" />, color: 'bg-orange-500' },
  { id: 'fat-loss', label: 'Perte de Graisse', icon: <BoltIcon className="h-5 w-5" />, color: 'bg-green-500' },
  { id: 'endurance', label: 'Endurance', icon: <HeartIcon className="h-5 w-5" />, color: 'bg-blue-500' },
  { id: 'power', label: 'Puissance', icon: <BoltIcon className="h-5 w-5" />, color: 'bg-purple-500' },
  { id: 'athleticism', label: 'Athlétisme', icon: <StarIcon className="h-5 w-5" />, color: 'bg-indigo-500' }
];

const experienceOptions = [
  { id: 'beginner', label: 'Débutant', description: '0-1 ans d\'expérience' },
  { id: 'intermediate', label: 'Intermédiaire', description: '1-3 ans d\'expérience' },
  { id: 'advanced', label: 'Avancé', description: '3-5 ans d\'expérience' },
  { id: 'expert', label: 'Expert', description: '5+ ans d\'expérience' }
];

const equipmentOptions = [
  'barbell', 'dumbbells', 'kettlebells', 'resistance-bands', 'pull-up-bar',
  'bench', 'squat-rack', 'power-rack', 'cables', 'machines', 'bodyweight'
];

export const ProtocolGenerator: React.FC<ProtocolGeneratorProps> = ({ 
  user, 
  onProtocolGenerated 
}) => {
  const { t, formatNumber } = useTranslation();
  const [step, setStep] = useState<'setup' | 'templates' | 'results'>('setup');
  const [formData, setFormData] = useState<GenerationFormData>({
    goals: user?.profile?.goals || ['muscle-gain'],
    experience: user?.profile?.fitnessLevel || 'intermediate',
    equipment: user?.profile?.equipment || ['dumbbells', 'barbell'],
    timeAvailable: user?.profile?.availableTime || 60,
    frequency: user?.profile?.frequency || 3,
    duration: 8,
    bodyWeight: user?.profile?.weight || 75,
    age: user?.profile?.age || 30,
    preferences: [],
    limitations: []
  });

  const {
    isGenerating,
    generatedProtocol,
    recommendedTemplates,
    savedProtocols,
    error,
    generateProtocol,
    generateFromTemplate,
    saveProtocol,
    exportProtocol,
    validateParams
  } = useProtocolGeneration(user);

  const {
    filteredTemplates,
    selectedTemplate,
    selectTemplate,
    clearSelection,
    updateFilter,
    filterCriteria
  } = useTemplateSelection();

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateParams(formData);
    if (!validation.isValid) {
      alert(`Erreurs: ${validation.errors.join(', ')}`);
      return;
    }

    const protocol = await generateProtocol(formData);
    if (protocol) {
      setStep('results');
      onProtocolGenerated?.(protocol);
    }
  };

  const handleTemplateGeneration = async (templateId: string) => {
    const protocol = await generateFromTemplate(templateId, formData);
    if (protocol) {
      setStep('results');
      onProtocolGenerated?.(protocol);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <CogIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">
          Générateur de Protocoles G-Maxing
        </h3>
        <p className="text-gray-300 mb-6">
          Connectez-vous pour générer vos protocoles personnalisés
        </p>
        <Button variant="primary" className="glass-btn-primary">
          Se Connecter
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center mb-4"
        >
          <CogIcon className="h-8 w-8 text-primary-400 mr-3" />
          <h1 className="text-3xl font-bold text-white">
            Générateur G-Maxing
          </h1>
        </motion.div>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Créez votre protocole d'entraînement personnalisé basé sur la méthodologie 
          révolutionnaire d'Engel Garcia Gomez
        </p>
      </div>

      {/* Step Navigation */}
      <div className="flex justify-center">
        <div className="flex items-center space-x-4">
          {[
            { id: 'setup', label: 'Configuration', icon: CogIcon },
            { id: 'templates', label: 'Templates', icon: DocumentTextIcon },
            { id: 'results', label: 'Résultats', icon: CheckCircleIcon }
          ].map((stepItem, index) => (
            <React.Fragment key={stepItem.id}>
              <button
                onClick={() => setStep(stepItem.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  step === stepItem.id
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <stepItem.icon className="h-5 w-5" />
                <span className="hidden sm:inline">{stepItem.label}</span>
              </button>
              {index < 2 && (
                <ArrowRightIcon className="h-4 w-4 text-gray-600" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {step === 'setup' && (
          <motion.div
            key="setup"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <SetupStep
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleFormSubmit}
              isGenerating={isGenerating}
              error={error}
              validateParams={validateParams}
            />
          </motion.div>
        )}

        {step === 'templates' && (
          <motion.div
            key="templates"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <TemplateStep
              templates={recommendedTemplates}
              selectedTemplate={selectedTemplate}
              onTemplateSelect={selectTemplate}
              onTemplateGenerate={handleTemplateGeneration}
              isGenerating={isGenerating}
            />
          </motion.div>
        )}

        {step === 'results' && generatedProtocol && (
          <motion.div
            key="results"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <ResultsStep
              protocol={generatedProtocol}
              onSave={() => saveProtocol(generatedProtocol)}
              onExport={() => exportProtocol(generatedProtocol)}
              savedProtocols={savedProtocols}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Setup Step Component
const SetupStep: React.FC<{
  formData: GenerationFormData;
  setFormData: React.Dispatch<React.SetStateAction<GenerationFormData>>;
  onSubmit: (e: React.FormEvent) => void;
  isGenerating: boolean;
  error: string | null;
  validateParams: any;
}> = ({ formData, setFormData, onSubmit, isGenerating, error, validateParams }) => {
  const validation = validateParams(formData);

  return (
    <form onSubmit={onSubmit} className="space-y-8 max-w-4xl mx-auto">
      {/* Goals Selection */}
      <GlassCard className="p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <TrophyIcon className="h-6 w-6 text-primary-400 mr-2" />
          Objectifs d'Entraînement
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {goalOptions.map(goal => (
            <button
              key={goal.id}
              type="button"
              onClick={() => {
                const newGoals = formData.goals.includes(goal.id)
                  ? formData.goals.filter(g => g !== goal.id)
                  : [...formData.goals, goal.id];
                setFormData(prev => ({ ...prev, goals: newGoals }));
              }}
              className={`p-4 rounded-lg border-2 transition-all ${
                formData.goals.includes(goal.id)
                  ? 'border-primary-500 bg-primary-500/10'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
            >
              <div className={`w-8 h-8 rounded-full ${goal.color} flex items-center justify-center mb-2 mx-auto`}>
                {goal.icon}
              </div>
              <div className="text-white font-medium text-sm">{goal.label}</div>
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Experience & Physical Info */}
      <div className="grid md:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <h3 className="text-lg font-bold text-white mb-4">Expérience</h3>
          <div className="space-y-3">
            {experienceOptions.map(exp => (
              <label key={exp.id} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="experience"
                  value={exp.id}
                  checked={formData.experience === exp.id}
                  onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                  formData.experience === exp.id 
                    ? 'border-primary-500 bg-primary-500' 
                    : 'border-gray-500'
                }`} />
                <div>
                  <div className="text-white font-medium">{exp.label}</div>
                  <div className="text-gray-400 text-sm">{exp.description}</div>
                </div>
              </label>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h3 className="text-lg font-bold text-white mb-4">Informations</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-white mb-2">Poids (kg)</label>
              <input
                type="number"
                value={formData.bodyWeight}
                onChange={(e) => setFormData(prev => ({ ...prev, bodyWeight: Number(e.target.value) }))}
                className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-primary-500"
                min="40"
                max="200"
              />
            </div>
            <div>
              <label className="block text-white mb-2">Âge</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData(prev => ({ ...prev, age: Number(e.target.value) }))}
                className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-primary-500"
                min="16"
                max="80"
              />
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Schedule */}
      <GlassCard className="p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center">
          <CalendarDaysIcon className="h-5 w-5 text-primary-400 mr-2" />
          Programme
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label className="block text-white mb-2">Temps par séance (min)</label>
            <input
              type="range"
              min="20"
              max="120"
              value={formData.timeAvailable}
              onChange={(e) => setFormData(prev => ({ ...prev, timeAvailable: Number(e.target.value) }))}
              className="w-full"
            />
            <div className="text-primary-400 text-center mt-1">{formData.timeAvailable} min</div>
          </div>
          <div>
            <label className="block text-white mb-2">Fréquence (séances/semaine)</label>
            <input
              type="range"
              min="1"
              max="7"
              value={formData.frequency}
              onChange={(e) => setFormData(prev => ({ ...prev, frequency: Number(e.target.value) }))}
              className="w-full"
            />
            <div className="text-primary-400 text-center mt-1">{formData.frequency}x/semaine</div>
          </div>
          <div>
            <label className="block text-white mb-2">Durée totale (semaines)</label>
            <input
              type="range"
              min="4"
              max="24"
              value={formData.duration}
              onChange={(e) => setFormData(prev => ({ ...prev, duration: Number(e.target.value) }))}
              className="w-full"
            />
            <div className="text-primary-400 text-center mt-1">{formData.duration} semaines</div>
          </div>
        </div>
      </GlassCard>

      {/* Validation & Submit */}
      <div className="text-center">
        {validation.warnings.length > 0 && (
          <div className="mb-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <div className="text-yellow-400 font-medium mb-2">⚠️ Avertissements:</div>
            <ul className="text-yellow-300 text-sm space-y-1">
              {validation.warnings.map((warning, index) => (
                <li key={index}>• {warning}</li>
              ))}
            </ul>
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <div className="text-red-400 font-medium">❌ {error}</div>
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={!validation.isValid || isGenerating}
          className="glass-btn-primary px-8 py-4 text-lg"
        >
          {isGenerating ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              Génération en cours...
            </>
          ) : (
            <>
              🧬 Générer Mon Protocole G-Maxing
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

// Template Step Component  
const TemplateStep: React.FC<{
  templates: WorkoutTemplate[];
  selectedTemplate: WorkoutTemplate | null;
  onTemplateSelect: (templateId: string) => void;
  onTemplateGenerate: (templateId: string) => void;
  isGenerating: boolean;
}> = ({ templates, selectedTemplate, onTemplateSelect, onTemplateGenerate, isGenerating }) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-4">
          Templates G-Maxing Recommandés
        </h2>
        <p className="text-gray-300">
          Choisissez un template pré-conçu pour une génération rapide
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map(template => (
          <GlassCard
            key={template.id}
            className={`p-6 cursor-pointer transition-all ${
              selectedTemplate?.id === template.id 
                ? 'border-primary-500 border-2' 
                : 'hover:scale-105'
            }`}
            onClick={() => onTemplateSelect(template.id)}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold">{template.name}</h3>
              <Badge variant={template.intensity === 'high' ? 'primary' : 'secondary'}>
                {template.intensity}
              </Badge>
            </div>

            <div className="space-y-2 mb-4 text-sm text-gray-300">
              <div className="flex items-center">
                <ClockIcon className="h-4 w-4 mr-2" />
                {template.duration} min
              </div>
              <div className="flex items-center">
                <TrophyIcon className="h-4 w-4 mr-2" />
                {template.targetGoals.join(', ')}
              </div>
            </div>

            <div className="flex flex-wrap gap-1 mb-4">
              {template.gMaxingPrinciples.slice(0, 3).map(principle => (
                <Badge key={principle} variant="secondary" className="text-xs">
                  {principle}
                </Badge>
              ))}
            </div>

            <Button
              variant="primary"
              size="sm"
              className="w-full glass-btn-primary"
              onClick={(e) => {
                e.stopPropagation();
                onTemplateGenerate(template.id);
              }}
              disabled={isGenerating}
            >
              {isGenerating ? 'Génération...' : 'Utiliser ce Template'}
            </Button>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

// Results Step Component
const ResultsStep: React.FC<{
  protocol: GeneratedProtocol;
  onSave: () => void;
  onExport: () => void;
  savedProtocols: GeneratedProtocol[];
}> = ({ protocol, onSave, onExport, savedProtocols }) => {
  const { formatNumber } = useTranslation();
  const isSaved = savedProtocols.some(p => p.id === protocol.id);

  return (
    <div className="space-y-6">
      {/* Protocol Header */}
      <GlassCard className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">{protocol.name}</h2>
            <p className="text-gray-300">{protocol.description}</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="text-right">
              <div className="text-3xl font-bold text-primary-400">
                {Math.round(protocol.gMaxingScore * 100)}%
              </div>
              <div className="text-xs text-gray-400">G-Maxing Score</div>
            </div>
          </div>
        </div>

        {/* Protocol Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-xl font-bold text-white">{protocol.duration}</div>
            <div className="text-gray-400 text-sm">semaines</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-white">{protocol.frequency}</div>
            <div className="text-gray-400 text-sm">séances/sem</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-white">{protocol.sessions.length}</div>
            <div className="text-gray-400 text-sm">séances types</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-white">
              {Math.round(protocol.estimatedResults.strengthGain)}%
            </div>
            <div className="text-gray-400 text-sm">gain force</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <Button
            variant="primary"
            className="glass-btn-primary"
            onClick={onSave}
            disabled={isSaved}
          >
            <BookmarkIcon className="mr-2 h-4 w-4" />
            {isSaved ? 'Sauvegardé' : 'Sauvegarder'}
          </Button>
          
          <Button variant="secondary" className="glass-btn-secondary" onClick={onExport}>
            <DownloadIcon className="mr-2 h-4 w-4" />
            Exporter
          </Button>
          
          <Button variant="ghost" className="text-primary-400">
            <ShareIcon className="mr-2 h-4 w-4" />
            Partager
          </Button>
        </div>
      </GlassCard>

      {/* Sessions Preview */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {protocol.sessions.slice(0, 6).map((session, index) => (
          <GlassCard key={session.id} className="p-4">
            <h4 className="text-white font-bold mb-2">{session.name}</h4>
            <div className="text-sm text-gray-300 space-y-1">
              <div>Type: {session.type}</div>
              <div>Durée: {session.totalDuration}min</div>
              <div>Exercices: {session.exercises.length}</div>
              <div>Calories: ~{session.estimatedCalories}</div>
            </div>
            <div className="mt-3">
              <Button variant="ghost" size="sm" className="text-primary-400">
                <PlayIcon className="mr-1 h-3 w-3" />
                Voir Détails
              </Button>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Estimated Results */}
      <GlassCard className="p-6">
        <h3 className="text-xl font-bold text-white mb-4">Résultats Estimés</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              +{protocol.estimatedResults.strengthGain}%
            </div>
            <div className="text-gray-400">Gain de Force</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">
              +{protocol.estimatedResults.muscleGain}kg
            </div>
            <div className="text-gray-400">Masse Musculaire</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-400">
              -{protocol.estimatedResults.fatLoss}kg
            </div>
            <div className="text-gray-400">Perte de Graisse</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">
              +{protocol.estimatedResults.enduranceImprovement}%
            </div>
            <div className="text-gray-400">Endurance</div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default ProtocolGenerator;
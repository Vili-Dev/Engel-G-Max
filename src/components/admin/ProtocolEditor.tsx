/**
 * Éditeur de Protocole Complet
 * Interface avancée pour créer et modifier les protocoles de supplémentation
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DocumentTextIcon,
  PhotoIcon,
  VideoCameraIcon,
  CurrencyEuroIcon,
  TagIcon,
  UserGroupIcon,
  ClockIcon,
  PlusIcon,
  TrashIcon,
  EyeIcon,
  CloudArrowUpIcon,
  CheckCircleIcon,
  XMarkIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  SparklesIcon,
  BeakerIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';
import { 
  SupplementProtocol, 
  ProtocolCategory, 
  TargetAudience, 
  DifficultyLevel, 
  ProtocolInclude,
  ProtocolImage,
  ProtocolVideo,
  CreateProtocolRequest 
} from '../../types/supplementProtocol';

interface ProtocolEditorProps {
  protocol?: SupplementProtocol | null;
  onSave: (protocol: SupplementProtocol | CreateProtocolRequest) => void;
  onCancel: () => void;
}

const ProtocolEditor: React.FC<ProtocolEditorProps> = ({ protocol, onSave, onCancel }) => {
  // Form state
  const [formData, setFormData] = useState<CreateProtocolRequest>({
    name: protocol?.name || '',
    shortDescription: protocol?.shortDescription || '',
    longDescription: protocol?.longDescription || '',
    price: protocol?.price || 29,
    category: protocol?.category || 'looxmax',
    targetAudience: protocol?.targetAudience || ['beginners'],
    difficulty: protocol?.difficulty || 'beginner',
    duration: protocol?.duration || '',
    content: protocol?.content || '',
    includes: protocol?.includes || [],
    requirements: protocol?.requirements || [],
    tags: protocol?.tags || [],
    estimatedBudget: protocol?.estimatedBudget || undefined,
    seoTitle: protocol?.seoTitle || '',
    seoDescription: protocol?.seoDescription || '',
    featuredImage: protocol?.featuredImage || ''
  });

  const [activeTab, setActiveTab] = useState<'basic' | 'content' | 'media' | 'pricing' | 'seo' | 'preview'>('basic');
  const [images, setImages] = useState<ProtocolImage[]>(protocol?.gallery || []);
  const [videos, setVideos] = useState<ProtocolVideo[]>(protocol?.videos || []);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [previewMode, setPreviewMode] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom du protocole est requis';
    }
    if (!formData.shortDescription.trim()) {
      newErrors.shortDescription = 'La description courte est requise';
    }
    if (!formData.longDescription.trim()) {
      newErrors.longDescription = 'La description longue est requise';
    }
    if (formData.price <= 0) {
      newErrors.price = 'Le prix doit être supérieur à 0';
    }
    if (!formData.content.trim()) {
      newErrors.content = 'Le contenu du protocole est requis';
    }
    if (formData.includes.length === 0) {
      newErrors.includes = 'Au moins un élément inclus est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      if (protocol) {
        onSave({ ...protocol, ...formData, updatedAt: new Date() });
      } else {
        onSave(formData);
      }
    }
  };

  const handleInputChange = (field: keyof CreateProtocolRequest, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const addIncludeItem = () => {
    const newItem: Omit<ProtocolInclude, 'id'> = {
      type: 'supplement',
      name: '',
      description: ''
    };
    setFormData(prev => ({
      ...prev,
      includes: [...prev.includes, newItem]
    }));
  };

  const updateIncludeItem = (index: number, field: keyof Omit<ProtocolInclude, 'id'>, value: string) => {
    const newIncludes = [...formData.includes];
    newIncludes[index] = { ...newIncludes[index], [field]: value };
    setFormData(prev => ({ ...prev, includes: newIncludes }));
  };

  const removeIncludeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      includes: prev.includes.filter((_, i) => i !== index)
    }));
  };

  const addRequirement = () => {
    setFormData(prev => ({
      ...prev,
      requirements: [...(prev.requirements || []), '']
    }));
  };

  const updateRequirement = (index: number, value: string) => {
    const newRequirements = [...(formData.requirements || [])];
    newRequirements[index] = value;
    setFormData(prev => ({ ...prev, requirements: newRequirements }));
  };

  const removeRequirement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements?.filter((_, i) => i !== index) || []
    }));
  };

  const addTag = (tag: string) => {
    if (tag.trim() && !formData.tags.includes(tag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag.trim()]
      }));
    }
  };

  const removeTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    try {
      // Simulation d'upload - À remplacer par Cloudinary
      const mockUrl = URL.createObjectURL(file);
      const newImage: ProtocolImage = {
        id: Date.now().toString(),
        url: mockUrl,
        alt: file.name,
        caption: '',
        type: 'product'
      };
      setImages(prev => [...prev, newImage]);
    } catch (error) {
      console.error('Erreur upload image:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
  };

  // Auto-generate slug when name changes
  useEffect(() => {
    if (formData.name && !protocol) {
      const slug = generateSlug(formData.name);
      // Update slug if needed
    }
  }, [formData.name, protocol]);

  const tabs = [
    { id: 'basic', label: 'Informations', icon: InformationCircleIcon },
    { id: 'content', label: 'Contenu', icon: DocumentTextIcon },
    { id: 'media', label: 'Médias', icon: PhotoIcon },
    { id: 'pricing', label: 'Prix & Budget', icon: CurrencyEuroIcon },
    { id: 'seo', label: 'SEO', icon: SparklesIcon },
    { id: 'preview', label: 'Aperçu', icon: EyeIcon }
  ];

  const categoryOptions: { value: ProtocolCategory; label: string; icon: any; color: string }[] = [
    { value: 'looxmax', label: 'Looxmax (Apparence)', icon: SparklesIcon, color: 'text-pink-400' },
    { value: 'performance', label: 'Performance (SARMs)', icon: RocketLaunchIcon, color: 'text-blue-400' },
    { value: 'productivity', label: 'Productivité', icon: AcademicCapIcon, color: 'text-green-400' },
    { value: 'advanced', label: 'Avancé (Peptides)', icon: BeakerIcon, color: 'text-purple-400' },
    { value: 'coaching', label: 'Coaching', icon: BriefcaseIcon, color: 'text-yellow-400' }
  ];

  const audienceOptions: { value: TargetAudience; label: string }[] = [
    { value: 'beginners', label: 'Débutants' },
    { value: 'intermediate', label: 'Intermédiaires' },
    { value: 'advanced', label: 'Avancés' },
    { value: 'entrepreneurs', label: 'Entrepreneurs' },
    { value: 'students', label: 'Étudiants' },
    { value: 'athletes', label: 'Athlètes' },
    { value: 'busy_professionals', label: 'Professionnels occupés' }
  ];

  const includeTypeOptions = [
    { value: 'supplement', label: 'Supplément', icon: BeakerIcon },
    { value: 'guide', label: 'Guide', icon: DocumentTextIcon },
    { value: 'consultation', label: 'Consultation', icon: UserGroupIcon },
    { value: 'support', label: 'Support', icon: InformationCircleIcon },
    { value: 'tool', label: 'Outil', icon: SparklesIcon },
    { value: 'app', label: 'Application', icon: RocketLaunchIcon }
  ];

  const renderBasicInfo = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Informations principales */}
        <div className="space-y-6">
          <div>
            <label className="block text-white font-medium mb-2">
              Nom du Protocole *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`glass-input w-full ${errors.name ? 'border-red-500' : ''}`}
              placeholder="Ex: Looxmax, Natty Plus..."
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-white font-medium mb-2">
              Description Courte *
            </label>
            <textarea
              value={formData.shortDescription}
              onChange={(e) => handleInputChange('shortDescription', e.target.value)}
              className={`glass-input w-full h-24 resize-none ${errors.shortDescription ? 'border-red-500' : ''}`}
              placeholder="Description courte qui apparaîtra dans les listes..."
            />
            {errors.shortDescription && (
              <p className="text-red-400 text-sm mt-1">{errors.shortDescription}</p>
            )}
          </div>

          <div>
            <label className="block text-white font-medium mb-2">
              Description Longue *
            </label>
            <textarea
              value={formData.longDescription}
              onChange={(e) => handleInputChange('longDescription', e.target.value)}
              className={`glass-input w-full h-32 resize-none ${errors.longDescription ? 'border-red-500' : ''}`}
              placeholder="Description détaillée du protocole..."
            />
            {errors.longDescription && (
              <p className="text-red-400 text-sm mt-1">{errors.longDescription}</p>
            )}
          </div>

          <div>
            <label className="block text-white font-medium mb-2">
              Durée
            </label>
            <input
              type="text"
              value={formData.duration}
              onChange={(e) => handleInputChange('duration', e.target.value)}
              className="glass-input w-full"
              placeholder="Ex: 8 semaines, 6-12 semaines..."
            />
          </div>
        </div>

        {/* Configuration */}
        <div className="space-y-6">
          <div>
            <label className="block text-white font-medium mb-2">
              Catégorie *
            </label>
            <div className="grid grid-cols-1 gap-3">
              {categoryOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleInputChange('category', option.value)}
                    className={`glass-card p-4 text-left transition-all ${
                      formData.category === option.value
                        ? 'ring-2 ring-blue-500 bg-blue-500/10'
                        : 'hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <IconComponent className={`h-6 w-6 ${option.color}`} />
                      <span className="text-white font-medium">{option.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-white font-medium mb-2">
              Niveau de Difficulté *
            </label>
            <div className="flex space-x-4">
              {['beginner', 'intermediate', 'advanced'].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => handleInputChange('difficulty', level as DifficultyLevel)}
                  className={`flex-1 glass-card p-3 text-center transition-all ${
                    formData.difficulty === level
                      ? 'ring-2 ring-blue-500 bg-blue-500/10'
                      : 'hover:bg-white/5'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-1">
                    <div className={`w-3 h-3 rounded-full ${
                      level === 'beginner' ? 'bg-green-400' :
                      level === 'intermediate' ? 'bg-yellow-400' : 'bg-red-400'
                    }`} />
                    <span className="text-white text-sm capitalize">{level}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-white font-medium mb-2">
              Public Cible *
            </label>
            <div className="space-y-2">
              {audienceOptions.map((option) => (
                <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.targetAudience.includes(option.value)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        handleInputChange('targetAudience', [...formData.targetAudience, option.value]);
                      } else {
                        handleInputChange('targetAudience', formData.targetAudience.filter(a => a !== option.value));
                      }
                    }}
                    className="rounded border-gray-600 bg-gray-800 text-blue-500"
                  />
                  <span className="text-gray-300">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => (
    <div className="space-y-8">
      {/* Contenu principal */}
      <div>
        <label className="block text-white font-medium mb-2">
          Contenu du Protocole *
        </label>
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-sm">Éditeur de contenu</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                className="glass-btn-secondary px-3 py-1 text-sm"
              >
                Gras
              </button>
              <button
                type="button"
                className="glass-btn-secondary px-3 py-1 text-sm"
              >
                Italique
              </button>
              <button
                type="button"
                className="glass-btn-secondary px-3 py-1 text-sm"
              >
                Liste
              </button>
            </div>
          </div>
          <textarea
            ref={contentRef}
            value={formData.content}
            onChange={(e) => handleInputChange('content', e.target.value)}
            className={`w-full h-64 bg-transparent border border-white/20 rounded-lg p-4 text-white placeholder-gray-400 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.content ? 'border-red-500' : ''
            }`}
            placeholder="Décrivez le protocole en détail : dosages, fréquences, recommandations..."
          />
          {errors.content && (
            <p className="text-red-400 text-sm mt-2">{errors.content}</p>
          )}
        </div>
      </div>

      {/* Éléments inclus */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="text-white font-medium">
            Éléments Inclus *
          </label>
          <button
            type="button"
            onClick={addIncludeItem}
            className="glass-btn-primary px-4 py-2 flex items-center space-x-2"
          >
            <PlusIcon className="h-4 w-4" />
            <span>Ajouter</span>
          </button>
        </div>
        
        {formData.includes.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <BeakerIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">Aucun élément inclus. Ajoutez au moins un élément.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {formData.includes.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6"
              >
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-start">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Type</label>
                    <select
                      value={item.type}
                      onChange={(e) => updateIncludeItem(index, 'type', e.target.value)}
                      className="glass-input w-full"
                    >
                      {includeTypeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Nom</label>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => updateIncludeItem(index, 'name', e.target.value)}
                      className="glass-input w-full"
                      placeholder="Nom de l'élément..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Description</label>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateIncludeItem(index, 'description', e.target.value)}
                      className="glass-input w-full"
                      placeholder="Description courte..."
                    />
                  </div>
                  
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => removeIncludeItem(index)}
                      className="glass-btn-secondary p-2 text-red-400 hover:bg-red-500/10"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        {errors.includes && (
          <p className="text-red-400 text-sm mt-2">{errors.includes}</p>
        )}
      </div>

      {/* Prérequis */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="text-white font-medium">
            Prérequis/Exigences
          </label>
          <button
            type="button"
            onClick={addRequirement}
            className="glass-btn-secondary px-4 py-2 flex items-center space-x-2"
          >
            <PlusIcon className="h-4 w-4" />
            <span>Ajouter</span>
          </button>
        </div>
        
        <div className="space-y-3">
          {formData.requirements?.map((requirement, index) => (
            <div key={index} className="flex items-center space-x-3">
              <input
                type="text"
                value={requirement}
                onChange={(e) => updateRequirement(index, e.target.value)}
                className="glass-input flex-1"
                placeholder="Ex: Motivation, Budget 100-200€..."
              />
              <button
                type="button"
                onClick={() => removeRequirement(index)}
                className="glass-btn-secondary p-2 text-red-400 hover:bg-red-500/10"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          )) || []}
        </div>
      </div>
    </div>
  );

  const renderMedia = () => (
    <div className="space-y-8">
      {/* Image principale */}
      <div>
        <label className="block text-white font-medium mb-4">
          Image Principale
        </label>
        <div className="glass-card p-6">
          {formData.featuredImage ? (
            <div className="relative">
              <img
                src={formData.featuredImage}
                alt="Image principale"
                className="w-full h-48 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => handleInputChange('featuredImage', '')}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
              <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">Ajoutez une image principale</p>
              <input
                type="url"
                placeholder="URL de l'image ou uploadez..."
                value={formData.featuredImage}
                onChange={(e) => handleInputChange('featuredImage', e.target.value)}
                className="glass-input w-full max-w-md mx-auto"
              />
            </div>
          )}
        </div>
      </div>

      {/* Galerie d'images */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="text-white font-medium">
            Galerie d'Images
          </label>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="glass-btn-primary px-4 py-2 flex items-center space-x-2"
            disabled={isUploading}
          >
            {isUploading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <CloudArrowUpIcon className="h-4 w-4" />
            )}
            <span>Ajouter Images</span>
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => {
            const files = e.target.files;
            if (files) {
              Array.from(files).forEach(file => {
                handleImageUpload(file);
              });
            }
          }}
          className="hidden"
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={image.id} className="relative group">
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-32 object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          
          {images.length === 0 && (
            <div className="col-span-full">
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
                <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">Aucune image ajoutée</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Vidéos */}
      <div>
        <label className="block text-white font-medium mb-4">
          Vidéos Explicatives
        </label>
        <div className="glass-card p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <input
                type="url"
                placeholder="URL YouTube, Vimeo ou autre..."
                className="glass-input flex-1"
              />
              <button className="glass-btn-primary px-4 py-2">
                Ajouter Vidéo
              </button>
            </div>
            
            {videos.length === 0 && (
              <div className="text-center py-8">
                <VideoCameraIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">Aucune vidéo ajoutée</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPricing = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Prix et monétisation */}
        <div className="space-y-6">
          <div>
            <label className="block text-white font-medium mb-2">
              Prix de Vente * (EUR)
            </label>
            <div className="relative">
              <input
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                className={`glass-input w-full pl-10 ${errors.price ? 'border-red-500' : ''}`}
                min="0"
                step="0.01"
                placeholder="29.00"
              />
              <CurrencyEuroIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            {errors.price && (
              <p className="text-red-400 text-sm mt-1">{errors.price}</p>
            )}
          </div>

          <div className="glass-card p-4 bg-blue-500/5 border border-blue-500/20">
            <div className="flex items-start space-x-3">
              <InformationCircleIcon className="h-5 w-5 text-blue-400 mt-0.5" />
              <div>
                <p className="text-blue-300 text-sm font-medium">Intégration Stripe</p>
                <p className="text-blue-200 text-sm">
                  Un produit Stripe sera automatiquement créé lors de la sauvegarde.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Budget estimé */}
        <div className="space-y-6">
          <div>
            <label className="block text-white font-medium mb-4">
              Budget Estimé pour l'Utilisateur
            </label>
            <div className="glass-card p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Minimum (€)</label>
                  <input
                    type="number"
                    value={formData.estimatedBudget?.min || ''}
                    onChange={(e) => handleInputChange('estimatedBudget', {
                      ...formData.estimatedBudget,
                      min: parseFloat(e.target.value) || 0,
                      max: formData.estimatedBudget?.max || 0,
                      currency: 'EUR'
                    })}
                    className="glass-input w-full"
                    placeholder="100"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Maximum (€)</label>
                  <input
                    type="number"
                    value={formData.estimatedBudget?.max || ''}
                    onChange={(e) => handleInputChange('estimatedBudget', {
                      ...formData.estimatedBudget,
                      min: formData.estimatedBudget?.min || 0,
                      max: parseFloat(e.target.value) || 0,
                      currency: 'EUR'
                    })}
                    className="glass-input w-full"
                    placeholder="200"
                  />
                </div>
              </div>
              <p className="text-gray-400 text-sm mt-2">
                Budget que l'utilisateur devra prévoir pour les suppléments, produits, etc.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSEO = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-white font-medium mb-2">
              Titre SEO
            </label>
            <input
              type="text"
              value={formData.seoTitle}
              onChange={(e) => handleInputChange('seoTitle', e.target.value)}
              className="glass-input w-full"
              placeholder="Titre optimisé pour les moteurs de recherche..."
            />
            <p className="text-gray-400 text-sm mt-1">
              {formData.seoTitle.length}/60 caractères (optimus: 50-60)
            </p>
          </div>

          <div>
            <label className="block text-white font-medium mb-2">
              Description SEO
            </label>
            <textarea
              value={formData.seoDescription}
              onChange={(e) => handleInputChange('seoDescription', e.target.value)}
              className="glass-input w-full h-24 resize-none"
              placeholder="Description meta pour les moteurs de recherche..."
            />
            <p className="text-gray-400 text-sm mt-1">
              {formData.seoDescription.length}/160 caractères (optimun: 140-160)
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-white font-medium mb-2">
              Tags/Mots-clés
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => removeTag(index)}
                    className="hover:text-blue-100"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              placeholder="Ajouter un tag..."
              className="glass-input w-full"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const input = e.target as HTMLInputElement;
                  addTag(input.value);
                  input.value = '';
                }
              }}
            />
            <p className="text-gray-400 text-sm mt-1">
              Appuyez sur Entrée pour ajouter un tag
            </p>
          </div>

          <div className="glass-card p-4 bg-green-500/5 border border-green-500/20">
            <div className="flex items-start space-x-3">
              <CheckCircleIcon className="h-5 w-5 text-green-400 mt-0.5" />
              <div>
                <p className="text-green-300 text-sm font-medium">Optimisations Automatiques</p>
                <ul className="text-green-200 text-sm mt-1 space-y-1">
                  <li>• Génération automatique du slug URL</li>
                  <li>• Balises Open Graph pour les réseaux sociaux</li>
                  <li>• Structure de données JSON-LD</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPreview = () => (
    <div className="space-y-8">
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold text-white mb-4">Aperçu du Protocole</h3>
        
        {/* En-tête */}
        <div className="flex items-start space-x-6 mb-8">
          {formData.featuredImage && (
            <img
              src={formData.featuredImage}
              alt={formData.name}
              className="w-32 h-32 object-cover rounded-lg"
            />
          )}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white mb-2">{formData.name || 'Nom du protocole'}</h1>
            <p className="text-gray-300 mb-4">{formData.shortDescription || 'Description courte'}</p>
            
            <div className="flex items-center space-x-4 mb-4">
              <span className={`px-3 py-1 rounded-full text-sm ${
                formData.category === 'looxmax' ? 'bg-pink-500/20 text-pink-300' :
                formData.category === 'performance' ? 'bg-blue-500/20 text-blue-300' :
                formData.category === 'productivity' ? 'bg-green-500/20 text-green-300' :
                formData.category === 'advanced' ? 'bg-purple-500/20 text-purple-300' :
                'bg-yellow-500/20 text-yellow-300'
              }`}>
                {formData.category}
              </span>
              
              <span className={`text-sm ${
                formData.difficulty === 'beginner' ? 'text-green-400' :
                formData.difficulty === 'intermediate' ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {formData.difficulty}
              </span>
              
              {formData.duration && (
                <span className="text-gray-400 text-sm flex items-center">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  {formData.duration}
                </span>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-2xl font-bold text-white">{formData.price}€</span>
              {formData.estimatedBudget && (
                <span className="text-gray-400 text-sm">
                  Budget: {formData.estimatedBudget.min}-{formData.estimatedBudget.max}€
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Description longue */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-white mb-3">Description</h4>
          <p className="text-gray-300">{formData.longDescription || 'Description longue'}</p>
        </div>

        {/* Inclus */}
        {formData.includes.length > 0 && (
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-white mb-3">Ce qui est inclus</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.includes.map((item, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg">
                  <CheckCircleIcon className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-white font-medium">{item.name}</p>
                    <p className="text-gray-400 text-sm">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Prérequis */}
        {formData.requirements && formData.requirements.length > 0 && (
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-white mb-3">Prérequis</h4>
            <ul className="space-y-2">
              {formData.requirements.map((requirement, index) => (
                <li key={index} className="flex items-center space-x-2 text-gray-300">
                  <ExclamationTriangleIcon className="h-4 w-4 text-yellow-400" />
                  <span>{requirement}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tags */}
        {formData.tags.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold text-white mb-3">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {protocol ? 'Modifier le Protocole' : 'Nouveau Protocole'}
            </h1>
            <p className="text-gray-400">
              {protocol ? `Modification: ${protocol.name}` : 'Créez un nouveau protocole de supplémentation'}
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={onCancel}
              className="glass-btn-secondary px-6 py-3"
            >
              Annuler
            </button>
            <button 
              onClick={handleSave}
              className="glass-btn-primary px-6 py-3 flex items-center space-x-2"
            >
              <CheckCircleIcon className="h-5 w-5" />
              <span>{protocol ? 'Sauvegarder' : 'Créer le Protocole'}</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="glass-card p-2 mb-8">
          <nav className="flex space-x-2 overflow-x-auto">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <IconComponent className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'basic' && renderBasicInfo()}
            {activeTab === 'content' && renderContent()}
            {activeTab === 'media' && renderMedia()}
            {activeTab === 'pricing' && renderPricing()}
            {activeTab === 'seo' && renderSEO()}
            {activeTab === 'preview' && renderPreview()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProtocolEditor;
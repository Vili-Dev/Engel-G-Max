import React, { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { 
  UserIcon,
  UserGroupIcon,
  ComputerDesktopIcon,
  DocumentTextIcon,
  CheckIcon,
  StarIcon,
  ArrowRightIcon,
  PlayIcon,
  TrophyIcon,
  HeartIcon,
  LightBulbIcon,
  ChartBarIcon,
  FireIcon,
  BoltIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

// Components
import { LocalizedSEO } from '../components/seo/LocalizedSEO';
import { Button } from '../components/ui/Button';
import { GlassCard } from '../components/ui/GlassCard';

// Hooks
import { useTranslation } from '../hooks/useTranslation';

// Utils
import { cn } from '../utils/cn';

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  price: string;
  popular?: boolean;
  delay?: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ 
  icon, 
  title, 
  description, 
  features, 
  price,
  popular = false,
  delay = 0 
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay }}
      className="relative"
    >
      {popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 py-1 rounded-full text-sm font-bold">
            ⭐ Plus Populaire
          </div>
        </div>
      )}

      <GlassCard className={cn(
        "p-6 h-full hover:scale-105 transition-all duration-300 group",
        popular && "border-primary-500 border-2"
      )}>
        <div className="text-center mb-6">
          <div className="flex justify-center text-primary-400 mb-4 group-hover:text-primary-300 transition-colors">
            {icon}
          </div>
          <h3 className="text-white font-bold text-2xl mb-3">{title}</h3>
          <p className="text-gray-300 leading-relaxed mb-4">{description}</p>
          <div className="text-primary-400 font-bold text-3xl">
            {price}
          </div>
        </div>

        <div className="space-y-3 mb-6">
          {features.slice(0, isExpanded ? features.length : 3).map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
              transition={{ duration: 0.3, delay: delay + (index * 0.1) }}
              className="flex items-start"
            >
              <CheckIcon className="h-5 w-5 text-primary-400 mr-3 mt-0.5 flex-shrink-0" />
              <span className="text-gray-300 text-sm">{feature}</span>
            </motion.div>
          ))}
        </div>

        {features.length > 3 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-primary-400 text-sm hover:text-primary-300 mb-6 transition-colors"
          >
            {isExpanded ? 'Voir moins' : `+${features.length - 3} autres avantages`}
          </button>
        )}

        <div className="space-y-3">
          <Button
            variant="primary"
            className="w-full glass-btn-primary"
          >
            Choisir ce Service
            <ArrowRightIcon className="ml-2 h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            className="w-full text-primary-400 hover:text-primary-300"
            onClick={() => setIsExpanded(true)}
          >
            Plus de Détails
          </Button>
        </div>
      </GlassCard>
    </motion.div>
  );
};

interface ProcessStepProps {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  delay?: number;
}

const ProcessStep: React.FC<ProcessStepProps> = ({ 
  number, 
  title, 
  description, 
  icon, 
  delay = 0 
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay }}
      className="text-center"
    >
      <div className="relative mb-6">
        <motion.div
          className="w-20 h-20 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.2 }}
        >
          <div className="text-white">
            {icon}
          </div>
        </motion.div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
          {number}
        </div>
      </div>
      
      <h3 className="text-white font-bold text-xl mb-3">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </motion.div>
  );
};

const ServicesPage: React.FC = () => {
  const { t, language, formatCurrency } = useTranslation();
  const [showVideoModal, setShowVideoModal] = useState(false);

  // Refs for animations
  const heroRef = useRef(null);
  const servicesRef = useRef(null);
  const processRef = useRef(null);
  const methodologyRef = useRef(null);

  const heroInView = useInView(heroRef, { once: true });
  const servicesInView = useInView(servicesRef, { once: true });
  const processInView = useInView(processRef, { once: true });
  const methodologyInView = useInView(methodologyRef, { once: true });

  // SEO-optimized data
  const getSEOData = () => {
    switch (language) {
      case 'fr':
        return {
          title: "Services Coaching G-Maxing Engel Garcia Gomez - Transformation Physique Elite",
          description: "Découvrez les services de coaching premium d'Engel Garcia Gomez. Coaching personnel, groupe, en ligne et développement de protocoles G-Maxing personnalisés pour des résultats exceptionnels.",
          keywords: "coaching Engel Garcia Gomez, services G-Maxing, coaching personnel, transformation physique, protocoles personnalisés, coaching en ligne"
        };
      case 'es':
        return {
          title: "Servicios Coaching G-Maxing Engel Garcia Gomez - Transformación Física Elite", 
          description: "Descubre los servicios de coaching premium de Engel Garcia Gomez. Coaching personal, grupal, online y desarrollo de protocolos G-Maxing personalizados para resultados excepcionales.",
          keywords: "coaching Engel Garcia Gomez, servicios G-Maxing, coaching personal, transformación física, protocolos personalizados, coaching online"
        };
      default:
        return {
          title: "G-Maxing Coaching Services Engel Garcia Gomez - Elite Physical Transformation",
          description: "Discover Engel Garcia Gomez's premium coaching services. Personal, group, online coaching and personalized G-Maxing protocol development for exceptional results.",
          keywords: "Engel Garcia Gomez coaching, G-Maxing services, personal coaching, physical transformation, personalized protocols, online coaching"
        };
    }
  };

  const seoData = getSEOData();

  // Services data
  const services = [
    {
      icon: <UserIcon className="h-12 w-12" />,
      title: t('services.personal_coaching.title'),
      description: t('services.personal_coaching.description'),
      features: [
        "Évaluation biomécanique complète et analyse posturale",
        "Protocoles G-Maxing 100% personnalisés selon vos objectifs",
        "Séances individuelles avec Engel Garcia Gomez",
        "Suivi nutritionnel complet et optimisation hormonale",
        "Analyses sanguines et ajustements en temps réel",
        "Support mental et coaching psychologique",
        "Accès prioritaire aux nouvelles méthodes G-Maxing",
        "Garantie résultats ou remboursement intégral"
      ],
      price: "Sur devis",
      popular: false
    },
    {
      icon: <UserGroupIcon className="h-12 w-12" />,
      title: t('services.group_training.title'),
      description: t('services.group_training.description'),
      features: [
        "Groupes de maximum 6 personnes pour un suivi optimal",
        "Protocoles G-Maxing adaptés au niveau du groupe",
        "Sessions dynamiques et motivation collective",
        "Coaching direct par Engel Garcia Gomez",
        "Plans nutritionnels personnalisés pour chaque membre",
        "Challenges mensuels et récompenses",
        "Accès à la communauté privée G-Maxing Elite"
      ],
      price: formatCurrency(197) + "/mois",
      popular: true
    },
    {
      icon: <ComputerDesktopIcon className="h-12 w-12" />,
      title: t('services.online_coaching.title'),
      description: t('services.online_coaching.description'),
      features: [
        "Plateforme exclusive avec IA intégrée",
        "Protocoles G-Maxing personnalisés en temps réel",
        "Vidéos d'exercices avec corrections techniques",
        "Sessions vidéo hebdomadaires avec Engel",
        "Application mobile avec suivi complet",
        "Communauté mondiale de pratiquants G-Maxing",
        "Bibliothèque de +500 protocoles d'entraînement"
      ],
      price: formatCurrency(97) + "/mois",
      popular: false
    },
    {
      icon: <DocumentTextIcon className="h-12 w-12" />,
      title: t('services.protocol_development.title'),
      description: t('services.protocol_development.description'),
      features: [
        "Analyse complète de vos besoins spécifiques",
        "Développement sur mesure par Engel Garcia Gomez",
        "Méthodologie G-Maxing adaptée à votre sport",
        "Tests et validations scientifiques",
        "Formation complète à l'utilisation du protocole",
        "Mises à jour et évolutions permanentes",
        "Certification officielle G-Maxing"
      ],
      price: "À partir de " + formatCurrency(997),
      popular: false
    }
  ];

  // Process steps
  const processSteps = [
    {
      number: "1",
      title: "Évaluation Complète",
      description: "Analyse biomécanique, tests de performance et évaluation de votre potentiel génétique unique.",
      icon: <ChartBarIcon className="h-8 w-8" />
    },
    {
      number: "2", 
      title: "Protocole Personnalisé",
      description: "Création d'un protocole G-Maxing 100% adapté à votre profil, objectifs et contraintes.",
      icon: <DocumentTextIcon className="h-8 w-8" />
    },
    {
      number: "3",
      title: "Mise en Application",
      description: "Coaching direct et accompagnement dans l'exécution de votre protocole optimisé.",
      icon: <TrophyIcon className="h-8 w-8" />
    },
    {
      number: "4",
      title: "Suivi & Optimisation",
      description: "Ajustements permanents basés sur vos progrès et l'évolution de vos performances.",
      icon: <BoltIcon className="h-8 w-8" />
    }
  ];

  return (
    <>
      {/* SEO Optimization */}
      <LocalizedSEO
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        image="/images/engel-garcia-gomez-services.jpg"
      />

      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Hero Content */}
        <div className="relative z-20 container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <motion.h1
              className="text-4xl md:text-6xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              🧬 Services de Coaching
              <span className="block bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
                G-Maxing d'Engel Garcia Gomez
              </span>
            </motion.h1>

            <motion.p
              className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {t('services.subtitle')}
            </motion.p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mb-12"
          >
            {[
              { number: "15,000+", label: "Clients Transformés" },
              { number: "98%", label: "Taux de Réussite" },
              { number: "25+", label: "Pays Couverts" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-primary-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-300 text-sm">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              size="lg"
              variant="primary"
              className="glass-btn-primary text-lg px-8 py-4"
            >
              🎯 Consultation Gratuite
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Button>
            
            <Button
              size="lg"
              variant="secondary"
              className="glass-btn-secondary text-lg px-8 py-4 group"
              onClick={() => setShowVideoModal(true)}
            >
              <PlayIcon className="mr-2 h-5 w-5 group-hover:animate-pulse" />
              Voir la Méthode G-Maxing
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section ref={servicesRef} className="py-20 bg-black/20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={servicesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              🏆 Nos Services de Coaching G-Maxing
            </h2>
            <p className="text-gray-300 text-lg max-w-3xl mx-auto">
              Choisissez le niveau d'accompagnement qui correspond à vos objectifs et 
              bénéficiez de l'expertise d'Engel Garcia Gomez.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {services.map((service, index) => (
              <ServiceCard
                key={index}
                {...service}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section ref={processRef} className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={processInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              🔄 Notre Processus G-Maxing
            </h2>
            <p className="text-gray-300 text-lg max-w-3xl mx-auto">
              Une méthodologie éprouvée en 4 étapes pour maximiser votre potentiel génétique 
              et atteindre vos objectifs de transformation.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <ProcessStep
                key={index}
                {...step}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Methodology Section */}
      <section ref={methodologyRef} className="py-20 bg-black/20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={methodologyInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                🧬 La Science derrière G-Maxing
              </h2>
              <p className="text-gray-300 text-lg mb-8">
                La méthode G-Maxing d'Engel Garcia Gomez s'appuie sur les dernières 
                recherches en génétique, biomécanique et physiologie de l'exercice.
              </p>

              <div className="space-y-6">
                {[
                  {
                    icon: <FireIcon className="h-6 w-6" />,
                    title: "Optimisation Génétique",
                    description: "Analyse de vos polymorphismes pour adapter l'entraînement à votre ADN"
                  },
                  {
                    icon: <BoltIcon className="h-6 w-6" />,
                    title: "Biomécanique Avancée", 
                    description: "Correction des patterns de mouvement pour maximiser l'efficience"
                  },
                  {
                    icon: <HeartIcon className="h-6 w-6" />,
                    title: "Adaptation Hormonale",
                    description: "Protocoles optimisés pour votre profil hormonal spécifique"
                  },
                  {
                    icon: <LightBulbIcon className="h-6 w-6" />,
                    title: "Intelligence Artificielle",
                    description: "IA propriétaire pour l'ajustement en temps réel des protocoles"
                  }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={methodologyInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-start"
                  >
                    <div className="text-primary-400 mr-4 mt-1">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-2">{item.title}</h4>
                      <p className="text-gray-300">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={methodologyInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
              transition={{ duration: 0.8 }}
            >
              <GlassCard className="p-8">
                <div className="aspect-square bg-gradient-to-br from-primary-500/20 to-primary-600/20 rounded-lg flex items-center justify-center mb-6">
                  <div className="text-center">
                    <div className="text-4xl mb-4">🧬</div>
                    <div className="text-white font-bold text-xl">G-MAXING</div>
                    <div className="text-primary-400 text-sm">Genetic Maximization</div>
                  </div>
                </div>
                
                <h3 className="text-white font-bold text-xl mb-4 text-center">
                  Résultats Scientifiquement Prouvés
                </h3>
                
                <div className="space-y-3 text-center">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Gain de force :</span>
                    <span className="text-primary-400 font-bold">+247%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Perte de graisse :</span>
                    <span className="text-primary-400 font-bold">+189%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Gain musculaire :</span>
                    <span className="text-primary-400 font-bold">+156%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Récupération :</span>
                    <span className="text-primary-400 font-bold">+78%</span>
                  </div>
                </div>

                <p className="text-gray-400 text-xs text-center mt-4">
                  *Comparé aux méthodes traditionnelles sur 12 semaines
                </p>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <GlassCard className="max-w-4xl mx-auto p-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                🚀 Commencez Votre Transformation G-Maxing Aujourd'hui
              </h2>
              <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                Rejoignez les 15,000+ athlètes qui ont révolutionné leur physique avec 
                Engel Garcia Gomez et sa méthode G-Maxing scientifique.
              </p>
              
              <Button 
                variant="primary" 
                size="lg" 
                className="glass-btn-primary text-xl px-12 py-6 mb-6"
              >
                🎯 Consultation Gratuite de 30 Minutes
                <ArrowRightIcon className="ml-2 h-6 w-6" />
              </Button>

              <div className="text-gray-400 text-sm">
                ✅ 100% Gratuit • ✅ Sans Engagement • ✅ Analyse Personnalisée
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* Video Modal */}
      <AnimatePresence>
        {showVideoModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setShowVideoModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-lg max-w-4xl w-full aspect-video relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowVideoModal(false)}
                className="absolute -top-4 -right-4 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
              
              <div className="w-full h-full bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <div className="text-center text-white">
                  <PlayIcon className="h-16 w-16 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Méthode G-Maxing</h3>
                  <p className="text-primary-100">Vidéo explicative complète</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ServicesPage;
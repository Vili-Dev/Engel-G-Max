import React, { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { 
  AcademicCapIcon,
  TrophyIcon,
  UserGroupIcon,
  ChartBarIcon,
  HeartIcon,
  LightBulbIcon,
  FireIcon,
  StarIcon,
  CheckBadgeIcon,
  ArrowRightIcon,
  PlayIcon
} from '@heroicons/react/24/outline';

// Components
import { EngelGarciaSEO } from '../components/seo/LocalizedSEO';
import Button from '../components/ui/Button';
import GlassCard from '../components/ui/GlassCard';

// Hooks
import { useTranslation } from '../hooks/useTranslation';

// Utils
import { cn } from '../utils/cn';

interface ExpertiseCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}

const ExpertiseCard: React.FC<ExpertiseCardProps> = ({ 
  icon, 
  title, 
  description, 
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
    >
      <GlassCard className="p-6 h-full hover:scale-105 transition-all duration-300 group">
        <div className="text-primary-400 mb-4 group-hover:text-primary-300 transition-colors">
          {icon}
        </div>
        <h3 className="text-white font-bold text-xl mb-3">{title}</h3>
        <p className="text-gray-300 leading-relaxed">{description}</p>
      </GlassCard>
    </motion.div>
  );
};

interface AchievementCardProps {
  icon: React.ReactNode;
  number: string;
  label: string;
  description: string;
  delay?: number;
}

const AchievementCard: React.FC<AchievementCardProps> = ({ 
  icon, 
  number, 
  label, 
  description, 
  delay = 0 
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.6, delay }}
    >
      <GlassCard className="p-6 text-center hover:scale-105 transition-all duration-300">
        <div className="flex justify-center text-primary-400 mb-4">
          {icon}
        </div>
        <motion.div
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : { scale: 0 }}
          transition={{ duration: 0.5, delay: delay + 0.2 }}
          className="text-4xl font-bold text-white mb-2"
        >
          {number}
        </motion.div>
        <h4 className="text-primary-300 font-semibold mb-2">{label}</h4>
        <p className="text-gray-300 text-sm">{description}</p>
      </GlassCard>
    </motion.div>
  );
};

const AboutPage: React.FC = () => {
  const { t, language } = useTranslation();
  const { scrollYProgress } = useScroll();
  
  // Parallax effects
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  
  // Refs for animations
  const heroRef = useRef(null);
  const expertiseRef = useRef(null);
  const achievementsRef = useRef(null);

  const heroInView = useInView(heroRef, { once: true });
  const expertiseInView = useInView(expertiseRef, { once: true });
  const achievementsInView = useInView(achievementsRef, { once: true });

  // SEO-optimized data based on language
  const getSEOData = () => {
    switch (language) {
      case 'fr':
        return {
          title: "Qui est Engel Garcia Gomez ? Expert G-Maxing et Coach Sportif d'Élite",
          description: "Découvrez l'histoire d'Engel Garcia Gomez, créateur de la méthode G-Maxing. Coach sportif passionné qui débute sa carrière avec une approche personnalisée pour maximiser votre potentiel et votre confiance.",
          keywords: "Engel Garcia Gomez biographie, expert G-Maxing, coach sportif élite, méthode transformation, entraîneur personnel, parcours professionnel"
        };
      case 'es':
        return {
          title: "¿Quién es Engel Garcia Gomez? Experto G-Maxing y Entrenador Deportivo de Élite",
          description: "Descubre la historia de Engel Garcia Gomez, creador del método G-Maxing revolucionario. Entrenador deportivo de élite con +15 años de experiencia, ha transformado miles de atletas mundialmente.",
          keywords: "Engel Garcia Gomez biografía, experto G-Maxing, entrenador deportivo élite, método transformación, entrenador personal, trayectoria profesional"
        };
      default:
        return {
          title: "Who is Engel Garcia Gomez? G-Maxing Expert and Elite Sports Coach",
          description: "Discover the story of Engel Garcia Gomez, creator of the G-Maxing method. Passionate sports coach starting his career with a personalized approach to maximize your potential and confidence.",
          keywords: "Engel Garcia Gomez biography, G-Maxing expert, elite sports coach, transformation method, personal trainer, professional journey"
        };
    }
  };

  const seoData = getSEOData();

  // Expertise areas
  const expertiseAreas = [
    {
      icon: <FireIcon className="h-8 w-8" />,
      title: t('about.expertise.strength'),
      description: t('about.expertise.descriptions.strength')
    },
    {
      icon: <ChartBarIcon className="h-8 w-8" />,
      title: t('about.expertise.performance'),
      description: t('about.expertise.descriptions.performance')
    },
    {
      icon: <HeartIcon className="h-8 w-8" />,
      title: t('about.expertise.recovery'),
      description: t('about.expertise.descriptions.recovery')
    },
    {
      icon: <LightBulbIcon className="h-8 w-8" />,
      title: t('about.expertise.nutrition'),
      description: t('about.expertise.descriptions.nutrition')
    },
    {
      icon: <UserGroupIcon className="h-8 w-8" />,
      title: t('about.expertise.psychology'),
      description: t('about.expertise.descriptions.psychology')
    },
    {
      icon: <AcademicCapIcon className="h-8 w-8" />,
      title: t('about.expertise.biomechanics'),
      description: t('about.expertise.descriptions.biomechanics')
    }
  ];

  // Achievements
  const achievements = [
    {
      icon: <CheckBadgeIcon className="h-12 w-12" />,
      number: t('about.achievements.items.engagement.number'),
      label: t('about.achievements.items.engagement.label'),
      description: t('about.achievements.items.engagement.description')
    },
    {
      icon: <AcademicCapIcon className="h-12 w-12" />,
      number: t('about.achievements.items.method.number'),
      label: t('about.achievements.items.method.label'),
      description: t('about.achievements.items.method.description')
    },
    {
      icon: <TrophyIcon className="h-12 w-12" />,
      number: t('about.achievements.items.clients.number'),
      label: t('about.achievements.items.clients.label'),
      description: t('about.achievements.items.clients.description')
    },
    {
      icon: <StarIcon className="h-12 w-12" />,
      number: t('about.achievements.items.records.number'),
      label: t('about.achievements.items.records.label'),
      description: t('about.achievements.items.records.description')
    }
  ];


  return (
    <>
      {/* SEO Optimization for Engel Garcia Gomez About Page */}
      <EngelGarciaSEO
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        image="/images/engel-garcia-gomez-about.jpg"
      />

      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden pb-20"
      >
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Hero Content */}
        <motion.div
          style={{ y: heroY }}
          className="relative z-20 container mx-auto px-6"
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Profile Image */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={heroInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative">
                <motion.div
                  className="w-80 h-80 mx-auto rounded-full bg-gradient-to-r from-primary-500 to-primary-600 p-1"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
                    <span className="text-6xl font-bold text-white">EG</span>
                  </div>
                </motion.div>
                
                {/* Floating badges */}
                <motion.div
                  className="absolute -top-4 -right-4 bg-primary-500 text-white px-4 py-2 rounded-full text-sm font-bold"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🏆 {t('about.badges.expert')}
                </motion.div>
                
                <motion.div
                  className="absolute -bottom-4 -left-4 bg-purple-500 text-white px-4 py-2 rounded-full text-sm font-bold"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                >
                  ⚡ {t('about.badges.experience')}
                </motion.div>
              </div>
            </motion.div>

            {/* Profile Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={heroInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.h1
                className="text-4xl md:text-6xl font-bold text-white mb-4"
                initial={{ opacity: 0, y: 30 }}
                animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <span className="bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
                  Engel Garcia
                </span>
              </motion.h1>

              <motion.h2
                className="text-xl md:text-2xl text-primary-300 mb-6 font-semibold"
                initial={{ opacity: 0, y: 30 }}
                animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                {t('about.subtitle')}
              </motion.h2>

              <motion.p
                className="text-gray-300 text-lg mb-8 leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                {t('about.description')}
              </motion.p>

              {/* Key highlights */}
              <motion.div
                className="space-y-3 mb-8"
                initial={{ opacity: 0, y: 30 }}
                animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.8, delay: 1 }}
              >
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={heroInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.5, delay: 1 }}
                  className="flex items-center text-white"
                >
                  <span className="mr-3">🧬</span>
                  <span>{t('about.highlights.creator')}</span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={heroInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.5, delay: 1.1 }}
                  className="flex items-center text-white"
                >
                  <span className="mr-3">🏆</span>
                  <span>{t('about.highlights.clients')}</span>
                </motion.div>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 30 }}
                animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.8, delay: 1.4 }}
              >
                <Button
                  size="lg"
                  variant="primary"
                  className="glass-btn-primary"
                >
                  🎯 {t('about.buttons.consultation')}
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Button>
                
                <Button
                  size="lg"
                  variant="secondary"
                  className="glass-btn-secondary group"
                >
                  <PlayIcon className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                  {t('about.buttons.method')}
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Expertise Section */}
      <section ref={expertiseRef} className="py-20 bg-black/20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={expertiseInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              🎯 {t('about.expertise.title')}
            </h2>
            <p className="text-gray-300 text-lg max-w-3xl mx-auto">
              {t('about.expertise.description')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {expertiseAreas.map((area, index) => (
              <ExpertiseCard
                key={index}
                {...area}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section ref={achievementsRef} className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={achievementsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              🏆 {t('about.achievements.title')}
            </h2>
            <p className="text-gray-300 text-lg max-w-3xl mx-auto">
              {t('about.achievements.description')}
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-8">
            {achievements.map((achievement, index) => (
              <AchievementCard
                key={index}
                {...achievement}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>


      {/* CTA Section */}
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
                🚀 {t('about.cta.title')}
              </h2>
              <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                {t('about.cta.description')}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Button 
                  variant="primary" 
                  size="lg" 
                  className="glass-btn-primary text-lg px-8 py-4"
                >
                  🎯 {t('about.cta.buttons.consultation')}
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Button>
                
                <Button 
                  variant="secondary" 
                  size="lg" 
                  className="glass-btn-secondary text-lg px-8 py-4"
                >
                  📖 {t('about.cta.buttons.programs')}
                </Button>
              </div>

              {/* Trust indicators */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center text-sm text-gray-400">
                <div>
                  <div className="text-primary-400 font-bold text-lg">24/7</div>
                  <div>{t('about.cta.features.support')}</div>
                </div>
                <div>
                  <div className="text-primary-400 font-bold text-lg">1</div>
                  <div>{t('about.cta.features.method')}</div>
                </div>
                <div>
                  <div className="text-primary-400 font-bold text-lg">100%</div>
                  <div>{t('about.cta.features.results')}</div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;
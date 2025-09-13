import React, { useEffect, useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { 
  ChevronRightIcon, 
  PlayIcon, 
  StarIcon,
  CheckIcon,
  TrophyIcon,
  FireIcon,
  BoltIcon,
  HeartIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

// Components
import { LocalizedSEO, EngelGarciaSEO } from '../components/seo/LocalizedSEO';
import { LanguageSwitcherGlass } from '../components/ui/LanguageSwitcher';
import Button from '../components/ui/Button';
import GlassCard from '../components/ui/GlassCard';

// Hooks
import { useTranslation } from '../hooks/useTranslation';

// Utils
import { cn } from '../utils/cn';

interface StatCardProps {
  number: string;
  label: string;
  icon: React.ReactNode;
  delay?: number;
}

const StatCard: React.FC<StatCardProps> = ({ number, label, icon, delay = 0 }) => {
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
      <GlassCard className="p-6 hover:scale-105 transition-transform duration-300">
        <div className="flex justify-center mb-4 text-primary-400">
          {icon}
        </div>
        <motion.div
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : { scale: 0 }}
          transition={{ duration: 0.5, delay: delay + 0.2 }}
          className="text-3xl font-bold text-white mb-2"
        >
          {number}
        </motion.div>
        <p className="text-gray-300 text-sm">{label}</p>
      </GlassCard>
    </motion.div>
  );
};

interface TestimonialCardProps {
  name: string;
  role: string;
  content: string;
  rating: number;
  image: string;
  delay?: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ 
  name, 
  role, 
  content, 
  rating, 
  image, 
  delay = 0 
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 50 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
      transition={{ duration: 0.6, delay }}
    >
      <GlassCard className="p-6 h-full">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-lg mr-4">
            {name.charAt(0)}
          </div>
          <div>
            <h4 className="text-white font-semibold">{name}</h4>
            <p className="text-gray-400 text-sm">{role}</p>
          </div>
        </div>
        <div className="flex mb-3">
          {[...Array(5)].map((_, i) => (
            <StarIcon
              key={i}
              className={cn(
                "h-4 w-4",
                i < rating ? "text-yellow-400 fill-current" : "text-gray-600"
              )}
            />
          ))}
        </div>
        <p className="text-gray-300 italic">"{content}"</p>
      </GlassCard>
    </motion.div>
  );
};

const HomePage: React.FC = () => {
  const { t, formatNumber } = useTranslation();
  const { scrollYProgress } = useScroll();
  
  // Parallax effects
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  // Refs for animations
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const testimonialsRef = useRef(null);

  const heroInView = useInView(heroRef, { once: true });
  const statsInView = useInView(statsRef, { once: true });
  const testimonialsInView = useInView(testimonialsRef, { once: true });

  // SEO-optimized data based on language
  const getSEOData = () => {
    const { language } = useTranslation();
    
    switch (language) {
      case 'fr':
        return {
          title: "Engel Garcia Gomez - Coach G-Maxing Expert | Transformation Physique Révolutionnaire",
          description: "Découvrez la méthode G-Maxing d'Engel Garcia Gomez, coach sportif d'élite. Transformez votre physique avec des protocoles scientifiques personnalisés et un coaching premium reconnu mondialement.",
          keywords: "Engel Garcia Gomez, G-Maxing, transformation physique, coach sportif, musculation, coaching personnel, protocoles entraînement, fitness expert"
        };
      case 'es':
        return {
          title: "Engel Garcia Gomez - Experto Entrenador G-Maxing | Transformación Física Revolucionaria",
          description: "Descubre el método G-Maxing de Engel Garcia Gomez, entrenador deportivo de élite. Transforma tu físico con protocolos científicos personalizados y coaching premium reconocido mundialmente.",
          keywords: "Engel Garcia Gomez, G-Maxing, transformación física, entrenador personal, musculación, coaching personal, protocolos entrenamiento, experto fitness"
        };
      default:
        return {
          title: "Engel Garcia Gomez - Expert G-Maxing Coach | Revolutionary Body Transformation",
          description: "Discover Engel Garcia Gomez's G-Maxing methodology, elite sports coach. Transform your physique with personalized scientific protocols and world-renowned premium coaching.",
          keywords: "Engel Garcia Gomez, G-Maxing, body transformation, sports coach, bodybuilding, personal training, workout protocols, fitness expert"
        };
    }
  };

  const seoData = getSEOData();

  // Statistics data
  const stats = [
    {
      number: formatNumber(15000),
      label: t('hero.stats.athletes_trained'),
      icon: <TrophyIcon className="h-8 w-8" />
    },
    {
      number: "98%",
      label: t('hero.stats.success_rate'),
      icon: <FireIcon className="h-8 w-8" />
    },
    {
      number: "12+",
      label: t('hero.stats.years_experience'),
      icon: <BoltIcon className="h-8 w-8" />
    },
    {
      number: formatNumber(500),
      label: t('hero.stats.protocols_created'),
      icon: <HeartIcon className="h-8 w-8" />
    }
  ];

  // Testimonials data
  const testimonials = [
    {
      name: "Marcus Rodriguez",
      role: "Professional Athlete",
      content: "Engel's G-Maxing method completely transformed my performance. I gained 15kg of muscle in 6 months while improving my agility.",
      rating: 5,
      image: "/testimonials/marcus.jpg"
    },
    {
      name: "Sarah Chen",
      role: "Fitness Enthusiast", 
      content: "The personalized protocols from Engel Garcia Gomez are incredible. I achieved results I never thought possible.",
      rating: 5,
      image: "/testimonials/sarah.jpg"
    },
    {
      name: "David Thompson",
      role: "Former Client",
      content: "Working with Engel changed my life. His G-Maxing methodology is scientifically backed and incredibly effective.",
      rating: 5,
      image: "/testimonials/david.jpg"
    }
  ];

  return (
    <>
      {/* SEO Optimization for Engel Garcia Gomez */}
      <EngelGarciaSEO
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        image="/images/engel-garcia-gomez-hero.jpg"
      />

      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden pb-20"
      >
        {/* Background Video/Image */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
          <div className="absolute inset-0 bg-black/30" />
          {/* Animated background particles */}
          <div className="absolute inset-0">
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white/20 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -100, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
        </div>

        {/* Language Switcher */}
        <div className="absolute top-6 right-6 z-30">
          <LanguageSwitcherGlass />
        </div>

        {/* Hero Content */}
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-20 text-center px-6 max-w-6xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={heroInView ? { scale: 1 } : { scale: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center"
            >
              <span className="text-4xl font-bold text-white">EG</span>
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <span className="bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
                EngelGMax
              </span>
            </motion.h1>

            <motion.h2
              className="text-xl md:text-2xl lg:text-3xl text-white mb-4"
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {t('hero.title')}
            </motion.h2>

            <motion.p
              className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {t('hero.description')}
            </motion.p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <Button
              size="lg"
              variant="primary"
              className="glass-btn-primary text-lg px-8 py-4 min-w-[200px]"
            >
              {t('hero.cta.primary')}
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Button>
            
            <Button
              size="lg"
              variant="secondary"
              className="glass-btn-secondary text-lg px-8 py-4 min-w-[200px] group"
            >
              <PlayIcon className="mr-2 h-5 w-5 group-hover:animate-pulse" />
              {t('hero.cta.secondary')}
            </Button>
          </motion.div>

          {/* Consultation CTA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={heroInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="mt-12"
          >
            <GlassCard className="inline-block p-4 hover:scale-105 transition-transform duration-300">
              <p className="text-primary-300 font-medium mb-2">
                🎯 {t('hero.cta.book_consultation')}
              </p>
              <p className="text-white text-sm">
                Découvrez votre potentiel avec une consultation personnalisée
              </p>
            </GlassCard>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronRightIcon className="h-6 w-6 text-white/60 rotate-90" />
        </motion.div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={statsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              🏆 Résultats Prouvés d'Engel Garcia Gomez
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Des milliers d'athlètes transformés avec la méthodologie G-Maxing révolutionnaire
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {stats.map((stat, index) => (
              <StatCard
                key={index}
                {...stat}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Methodology Preview */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                🧬 La Méthode G-Maxing d'Engel Garcia Gomez
              </h2>
              <p className="text-gray-300 text-lg mb-8">
                Une approche scientifique révolutionnaire qui optimise votre potentiel génétique 
                pour des transformations physiques exceptionnelles.
              </p>

              <div className="space-y-4">
                {[
                  'Analyse biomécanique complète',
                  'Protocoles personnalisés scientifiques', 
                  'Optimisation hormonale naturelle',
                  'Suivi en temps réel des progrès'
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center"
                  >
                    <CheckIcon className="h-5 w-5 text-primary-400 mr-3" />
                    <span className="text-white">{feature}</span>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8">
                <Button variant="primary" size="lg" className="glass-btn-primary">
                  Découvrir la Méthode G-Maxing
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <GlassCard className="p-8">
                <div className="aspect-video bg-gradient-to-br from-primary-500/20 to-primary-600/20 rounded-lg flex items-center justify-center mb-6">
                  <PlayIcon className="h-16 w-16 text-primary-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">
                  Transformation en Action
                </h3>
                <p className="text-gray-300">
                  Regardez comment la méthode G-Maxing transforme des athlètes du monde entier
                </p>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section ref={testimonialsRef} className="py-20 bg-black/20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={testimonialsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              💬 Témoignages Clients d'Engel Garcia Gomez
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Découvrez les transformations extraordinaires réalisées avec la méthode G-Maxing
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                {...testimonial}
                delay={index * 0.2}
              />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Button variant="secondary" size="lg" className="glass-btn-secondary">
              Voir Plus de Témoignages
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
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
            <GlassCard className="max-w-4xl mx-auto p-6 lg:p-12">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 lg:mb-6">
                🚀 Prêt à Transformer Votre Physique avec Engel Garcia Gomez ?
              </h2>
              <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                Rejoignez des milliers d'athlètes qui ont révolutionné leur entraînement 
                avec la méthode G-Maxing d'Engel Garcia Gomez.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="primary" 
                  size="lg" 
                  className="glass-btn-primary text-lg px-8 py-4"
                >
                  🎯 Consultation Gratuite
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Button>
                
                <Button 
                  variant="secondary" 
                  size="lg" 
                  className="glass-btn-secondary text-lg px-8 py-4"
                >
                  📚 Découvrir les Protocoles G-Maxing
                </Button>
              </div>

              <div className="mt-8 flex justify-center items-center space-x-6 text-sm text-gray-400">
                <div className="flex items-center">
                  <CheckIcon className="h-4 w-4 text-primary-400 mr-2" />
                  Consultation 100% gratuite
                </div>
                <div className="flex items-center">
                  <CheckIcon className="h-4 w-4 text-primary-400 mr-2" />
                  Protocoles scientifiques
                </div>
                <div className="flex items-center">
                  <CheckIcon className="h-4 w-4 text-primary-400 mr-2" />
                  Résultats garantis
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
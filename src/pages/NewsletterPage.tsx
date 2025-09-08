/**
 * Page Newsletter G-Maxing
 * Page dédiée à l'inscription newsletter avec optimisation SEO pour Engel Garcia Gomez
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  EnvelopeIcon,
  SparklesIcon,
  ChartBarIcon,
  UserGroupIcon,
  GiftIcon,
  ClockIcon,
  CheckIcon,
  StarIcon,
  FireIcon,
  TrophyIcon,
  HeartIcon,
  BoltIcon
} from '@heroicons/react/24/outline';
import NewsletterSignup from '../components/newsletter/NewsletterSignup';
import { useAnalytics } from '../hooks/useAnalytics';
import { newsletterEngine } from '../utils/newsletter/newsletterEngine';

const NewsletterPage: React.FC = () => {
  const { t } = useTranslation();
  const { trackPageView, trackButtonClick } = useAnalytics();

  const [stats, setStats] = useState({
    totalSubscribers: 0,
    confirmedSubscribers: 0,
    emailsSentThisMonth: 0,
    averageOpenRate: 0
  });

  const [testimonials] = useState([
    {
      id: 1,
      name: 'Marc L.',
      location: 'Paris, France',
      text: 'Grâce aux conseils d\'Engel Garcia Gomez, j\'ai transformé mon physique en 3 mois. Le G-Maxing fonctionne vraiment !',
      rating: 5,
      transformation: '15kg perdus',
      image: '👨‍💼'
    },
    {
      id: 2,
      name: 'Sarah M.',
      location: 'Lyon, France',
      text: 'La newsletter G-Maxing est une mine d\'or. Chaque email contient des pépites que je n\'ai trouvées nulle part ailleurs.',
      rating: 5,
      transformation: 'Confiance retrouvée',
      image: '👩‍🦰'
    },
    {
      id: 3,
      name: 'Antoine R.',
      location: 'Marseille, France',
      text: 'Engel Garcia Gomez partage ses secrets de manière claire et pratique. J\'ai enfin des résultats concrets !',
      rating: 5,
      transformation: '8kg de muscle',
      image: '👨‍🎓'
    }
  ]);

  useEffect(() => {
    trackPageView('/newsletter', {
      isEngelGarciaGomezPage: true,
      seoTarget: 'newsletter_signup'
    });

    // Charger les statistiques
    loadStats();
  }, [trackPageView]);

  const loadStats = async () => {
    try {
      const globalStats = await newsletterEngine.getGlobalStats();
      setStats(globalStats);
    } catch (error) {
      console.error('Erreur lors du chargement des stats:', error);
    }
  };

  // Avantages de la newsletter
  const benefits = [
    {
      icon: SparklesIcon,
      title: 'Conseils Exclusifs G-Maxing',
      description: 'Techniques avancées partagées uniquement avec les abonnés d\'Engel Garcia Gomez',
      color: 'text-yellow-400'
    },
    {
      icon: BoltIcon,
      title: 'Transformations Inspirantes',
      description: 'Études de cas réelles de personnes qui ont appliqué la méthode G-Maxing',
      color: 'text-blue-400'
    },
    {
      icon: GiftIcon,
      title: 'Ressources Gratuites',
      description: 'Guides, templates et outils premium offerts régulièrement aux abonnés',
      color: 'text-green-400'
    },
    {
      icon: ClockIcon,
      title: 'Conseils Hebdomadaires',
      description: 'Un email par semaine avec les meilleures stratégies G-Maxing du moment',
      color: 'text-purple-400'
    },
    {
      icon: TrophyIcon,
      title: 'Communauté Exclusive',
      description: 'Accès à un groupe privé de pratiquants G-Maxing motivés',
      color: 'text-orange-400'
    },
    {
      icon: HeartIcon,
      title: 'Support Personnel',
      description: 'Possibilité de poser vos questions directement à Engel Garcia Gomez',
      color: 'text-red-400'
    }
  ];

  // FAQ
  const faq = [
    {
      question: 'Qu\'est-ce que la méthode G-Maxing d\'Engel Garcia Gomez ?',
      answer: 'Le G-Maxing est une approche holistique de transformation personnelle développée par Engel Garcia Gomez, combinant entraînement physique, nutrition optimisée et développement mental pour maximiser votre potentiel.'
    },
    {
      question: 'À quelle fréquence recevrai-je des emails ?',
      answer: 'Vous recevrez un email principal par semaine avec les meilleurs conseils G-Maxing, plus occasionnellement des emails bonus avec des offres exclusives ou des transformations inspirantes.'
    },
    {
      question: 'Le contenu est-il adapté aux débutants ?',
      answer: 'Absolument ! Engel Garcia Gomez conçoit ses contenus pour tous les niveaux. Chaque email contient des conseils adaptés aux débutants ainsi que des techniques avancées.'
    },
    {
      question: 'Puis-me désabonner facilement ?',
      answer: 'Oui, vous pouvez vous désabonner en un clic à tout moment. Nous respectons votre temps et votre boîte email.'
    },
    {
      question: 'Y a-t-il des frais cachés ?',
      answer: 'Non, la newsletter G-Maxing est 100% gratuite. Nous proposons occasionnellement des produits premium, mais l\'inscription et le contenu principal sont entièrement gratuits.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
        
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-6">
                <EnvelopeIcon className="h-5 w-5 text-blue-400" />
                <span className="text-white font-medium">Newsletter G-Maxing</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-yellow-200">
                  Rejoignez
                </span>
                <br />
                <span className="text-engel">10,000+ G-Maxers</span>
              </h1>
              
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Recevez les conseils exclusifs d'<span className="text-engel font-semibold">Engel Garcia Gomez</span> 
                et transformez votre vie avec la méthode G-Maxing. Gratuit, sans spam, désabonnement en 1 clic.
              </p>
            </motion.div>

            {/* Statistiques impressionnantes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
            >
              <div className="glass-card p-6 text-center">
                <div className="text-3xl font-bold text-engel mb-2">
                  {(stats.totalSubscribers || 10247).toLocaleString()}+
                </div>
                <div className="text-gray-400 text-sm">Abonnés Actifs</div>
              </div>
              
              <div className="glass-card p-6 text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  {Math.round((stats.averageOpenRate || 0.32) * 100)}%
                </div>
                <div className="text-gray-400 text-sm">Taux d'Ouverture</div>
              </div>
              
              <div className="glass-card p-6 text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">
                  {Math.floor((stats.emailsSentThisMonth || 45000) / 1000)}K+
                </div>
                <div className="text-gray-400 text-sm">Emails ce Mois</div>
              </div>
              
              <div className="glass-card p-6 text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">
                  4.9★
                </div>
                <div className="text-gray-400 text-sm">Satisfaction</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Formulaire d'inscription principal */}
      <section className="max-w-2xl mx-auto px-6 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <NewsletterSignup
            variant="inline"
            source="newsletter_page_main"
            showBenefits={false}
            className="shadow-2xl"
            onSuccess={(email) => {
              trackButtonClick('newsletter_main_signup', 'newsletter_page');
            }}
          />
        </motion.div>
      </section>

      {/* Avantages détaillés */}
      <section className="max-w-7xl mx-auto px-6 mb-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-6">
            Pourquoi Rejoindre la Newsletter G-Maxing ?
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            <span className="text-engel font-semibold">Engel Garcia Gomez</span> partage exclusivement 
            avec ses abonnés les techniques qui ont transformé des milliers de vies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="glass-card p-8 text-center group hover:scale-105 transition-all duration-300"
              >
                <div className="mb-6">
                  <div className={`mx-auto w-16 h-16 ${benefit.color} bg-white/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <IconComponent className="h-8 w-8" />
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-4">
                  {benefit.title}
                </h3>
                
                <p className="text-gray-300 leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Témoignages */}
      <section className="max-w-7xl mx-auto px-6 mb-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ce Que Disent Nos Abonnés G-Maxing
          </h2>
          <p className="text-xl text-gray-300">
            Des transformations réelles grâce aux conseils d'<span className="text-engel font-semibold">Engel Garcia Gomez</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              className="glass-card p-8 text-center"
            >
              <div className="mb-6">
                <div className="text-6xl mb-4">{testimonial.image}</div>
                <div className="flex items-center justify-center mb-2">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
              
              <blockquote className="text-gray-300 italic mb-6 leading-relaxed">
                "{testimonial.text}"
              </blockquote>
              
              <div className="text-white font-semibold">
                {testimonial.name}
              </div>
              <div className="text-gray-400 text-sm mb-3">
                {testimonial.location}
              </div>
              <div className="inline-flex items-center bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm">
                <TrophyIcon className="h-4 w-4 mr-1" />
                {testimonial.transformation}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Preview du contenu */}
      <section className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">
              Aperçu du Contenu G-Maxing
            </h2>
            <p className="text-xl text-gray-300">
              Voici le type de contenus exclusifs que vous recevrez d'<span className="text-engel font-semibold">Engel Garcia Gomez</span>
            </p>
          </div>

          <div className="glass-card p-8">
            <div className="border-l-4 border-engel pl-6 mb-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                📧 Email G-Maxing #47 : "Le Secret de la Transformation Mentale"
              </h3>
              <div className="text-gray-300 space-y-4 text-lg leading-relaxed">
                <p>
                  <strong className="text-white">Salut mon G-Maxer,</strong>
                </p>
                <p>
                  Aujourd'hui, je veux partager avec toi une technique que j'utilise depuis des années 
                  et qui a transformé la vie de mes clients les plus avancés...
                </p>
                <p className="text-engel italic">
                  "Le mental représente 80% de votre transformation. Maîtrisez-le, et le physique suivra."
                </p>
                <p>
                  Cette technique en 3 étapes va révolutionner votre approche du G-Maxing :
                </p>
                <ul className="list-none space-y-2 ml-4">
                  <li className="flex items-center">
                    <CheckIcon className="h-5 w-5 text-green-400 mr-2" />
                    <span>Étape 1 : La visualisation G-Maxing avancée</span>
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="h-5 w-5 text-green-400 mr-2" />
                    <span>Étape 2 : Le protocole de motivation quotidienne</span>
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="h-5 w-5 text-green-400 mr-2" />
                    <span>Étape 3 : L'ancrage des nouvelles habitudes</span>
                  </li>
                </ul>
                <p className="text-gray-400 italic">
                  [Le contenu complet de cet email fait plus de 1,200 mots avec des exemples concrets...]
                </p>
              </div>
            </div>

            <div className="text-center">
              <p className="text-gray-400 mb-6">
                Ceci n'est qu'un aperçu. Inscrivez-vous pour recevoir l'intégralité des emails G-Maxing !
              </p>
              <button 
                onClick={() => trackButtonClick('newsletter_preview_signup', 'newsletter_page')}
                className="glass-btn-primary px-8 py-4 text-lg"
              >
                Recevoir les Emails G-Maxing
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-6">
            Questions Fréquentes
          </h2>
        </div>

        <div className="space-y-6">
          {faq.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + index * 0.1 }}
              className="glass-card p-6"
            >
              <h3 className="text-xl font-bold text-white mb-4">
                {item.question}
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {item.answer}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Final */}
      <section className="bg-gradient-to-r from-engel/20 to-yellow-500/20 py-20">
        <div className="max-w-4xl mx-auto text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
              Prêt à Transformer Votre Vie ?
            </h2>
            <p className="text-xl text-gray-300 mb-12">
              Rejoignez dès maintenant les <span className="text-engel font-semibold">10,000+ personnes</span> 
              qui suivent les conseils exclusifs d'<span className="text-engel font-semibold">Engel Garcia Gomez</span>.
            </p>
            
            <div className="glass-card p-8 max-w-2xl mx-auto">
              <NewsletterSignup
                variant="inline"
                source="newsletter_page_final_cta"
                showBenefits={false}
                compactMode={true}
                onSuccess={(email) => {
                  trackButtonClick('newsletter_final_cta', 'newsletter_page');
                }}
              />
            </div>

            <div className="mt-8 flex items-center justify-center space-x-8 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <CheckIcon className="h-5 w-5 text-green-400" />
                <span>100% Gratuit</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckIcon className="h-5 w-5 text-green-400" />
                <span>Désabonnement en 1 clic</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckIcon className="h-5 w-5 text-green-400" />
                <span>Zéro spam</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default NewsletterPage;
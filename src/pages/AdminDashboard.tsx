/**
 * Dashboard Administrateur G-Maxing
 * Interface de gestion complète pour Engel Garcia Gomez
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  ChartBarIcon,
  UserGroupIcon,
  EnvelopeIcon,
  ShoppingCartIcon,
  DocumentTextIcon,
  CogIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  ArrowTrendingUpIcon,
  BanknotesIcon,
  StarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  FireIcon,
  TrophyIcon,
  HeartIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { useAnalytics } from '../hooks/useAnalytics';
import { blogEngine } from '../utils/blog/blogEngine';
import { newsletterEngine } from '../utils/newsletter/newsletterEngine';

interface AdminStats {
  users: {
    total: number;
    active: number;
    newToday: number;
    premium: number;
  };
  newsletter: {
    subscribers: number;
    openRate: number;
    emailsSent: number;
    newSubscribers: number;
  };
  blog: {
    posts: number;
    totalViews: number;
    averageReadTime: number;
    topPost: string;
  };
  shop: {
    revenue: number;
    orders: number;
    conversion: number;
    topProduct: string;
  };
  coaching: {
    activeClients: number;
    completedSessions: number;
    satisfaction: number;
    revenue: number;
  };
}

const AdminDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { trackPageView, trackButtonClick } = useAnalytics();

  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'newsletter' | 'blog' | 'shop' | 'coaching' | 'settings'>('overview');
  const [stats, setStats] = useState<AdminStats>({
    users: { total: 15247, active: 8934, newToday: 127, premium: 2456 },
    newsletter: { subscribers: 10247, openRate: 32.4, emailsSent: 45678, newSubscribers: 89 },
    blog: { posts: 47, totalViews: 234567, averageReadTime: 4.2, topPost: 'Les Secrets du G-Maxing d\'Engel Garcia Gomez' },
    shop: { revenue: 89456, orders: 234, conversion: 3.2, topProduct: 'Programme G-Maxing Premium' },
    coaching: { activeClients: 156, completedSessions: 1234, satisfaction: 4.8, revenue: 145678 }
  });

  const [recentActivity, setRecentActivity] = useState([
    { id: 1, type: 'user', message: 'Nouvel utilisateur inscrit: marc@example.com', time: '5 min', status: 'success' },
    { id: 2, type: 'newsletter', message: 'Campagne newsletter envoyée: "G-Maxing Weekly #47"', time: '12 min', status: 'info' },
    { id: 3, type: 'shop', message: 'Nouvelle commande: Programme Premium - 297€', time: '18 min', status: 'success' },
    { id: 4, type: 'blog', message: 'Nouvel article publié: "Transformation Mentale G-Maxing"', time: '1h', status: 'info' },
    { id: 5, type: 'coaching', message: 'Session coaching terminée avec Antoine R.', time: '2h', status: 'success' }
  ]);

  useEffect(() => {
    trackPageView('/admin', {
      isAdminPage: true,
      userRole: 'admin'
    });

    loadDashboardData();
  }, [trackPageView]);

  const loadDashboardData = async () => {
    try {
      // Charger les données réelles depuis les services
      console.log('📊 Chargement des données dashboard...');
      
      // Blog stats
      const blogStats = blogEngine.getGlobalStats();
      
      // Newsletter stats  
      const newsletterStats = await newsletterEngine.getGlobalStats();
      
      setStats(prev => ({
        ...prev,
        newsletter: {
          subscribers: newsletterStats.confirmedSubscribers,
          openRate: newsletterStats.averageOpenRate * 100,
          emailsSent: newsletterStats.emailsSentThisMonth,
          newSubscribers: newsletterStats.pendingSubscribers
        }
      }));
      
      console.log('✅ Données dashboard chargées');
    } catch (error) {
      console.error('❌ Erreur chargement dashboard:', error);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: ChartBarIcon },
    { id: 'users', label: 'Utilisateurs', icon: UserGroupIcon },
    { id: 'newsletter', label: 'Newsletter', icon: EnvelopeIcon },
    { id: 'blog', label: 'Blog', icon: DocumentTextIcon },
    { id: 'shop', label: 'Boutique', icon: ShoppingCartIcon },
    { id: 'coaching', label: 'Coaching', icon: UserIcon },
    { id: 'settings', label: 'Paramètres', icon: CogIcon }
  ];

  const renderOverview = () => (
    <div className="space-y-8">
      {/* KPIs principaux */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Utilisateurs Totaux</p>
              <p className="text-3xl font-bold text-white">{stats.users.total.toLocaleString()}</p>
              <div className="flex items-center space-x-1 mt-2">
                <ArrowTrendingUpIcon className="h-4 w-4 text-green-400" />
                <span className="text-green-400 text-sm">+{stats.users.newToday} aujourd'hui</span>
              </div>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <UserGroupIcon className="h-8 w-8 text-blue-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Abonnés Newsletter</p>
              <p className="text-3xl font-bold text-white">{stats.newsletter.subscribers.toLocaleString()}</p>
              <div className="flex items-center space-x-1 mt-2">
                <ArrowTrendingUpIcon className="h-4 w-4 text-green-400" />
                <span className="text-green-400 text-sm">{stats.newsletter.openRate.toFixed(1)}% ouverture</span>
              </div>
            </div>
            <div className="p-3 bg-green-500/20 rounded-xl">
              <EnvelopeIcon className="h-8 w-8 text-green-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Revenus Boutique</p>
              <p className="text-3xl font-bold text-white">{stats.shop.revenue.toLocaleString()}€</p>
              <div className="flex items-center space-x-1 mt-2">
                <ArrowTrendingUpIcon className="h-4 w-4 text-green-400" />
                <span className="text-green-400 text-sm">{stats.shop.orders} commandes</span>
              </div>
            </div>
            <div className="p-3 bg-yellow-500/20 rounded-xl">
              <BanknotesIcon className="h-8 w-8 text-yellow-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Clients Coaching</p>
              <p className="text-3xl font-bold text-white">{stats.coaching.activeClients}</p>
              <div className="flex items-center space-x-1 mt-2">
                <StarIcon className="h-4 w-4 text-yellow-400" />
                <span className="text-yellow-400 text-sm">{stats.coaching.satisfaction}/5 satisfaction</span>
              </div>
            </div>
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <TrophyIcon className="h-8 w-8 text-purple-400" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Graphiques et activité récente */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Graphique des revenus */}
        <div className="lg:col-span-2 glass-card p-6">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            <ChartBarIcon className="h-6 w-6 text-blue-400 mr-2" />
            Évolution des Revenus G-Maxing
          </h3>
          
          {/* Simulation d'un graphique */}
          <div className="h-64 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl flex items-end justify-around p-4">
            {[65, 78, 45, 89, 67, 92, 76, 85, 94, 88, 96, 100].map((height, index) => (
              <div
                key={index}
                className="bg-gradient-to-t from-blue-500 to-purple-500 rounded-t-lg flex-1 mx-1 relative group cursor-pointer"
                style={{ height: `${height}%` }}
              >
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {(height * 100).toLocaleString()}€
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-between items-center mt-4 text-sm text-gray-400">
            <span>Jan</span>
            <span>Fév</span>
            <span>Mar</span>
            <span>Avr</span>
            <span>Mai</span>
            <span>Juin</span>
            <span>Jul</span>
            <span>Aoû</span>
            <span>Sep</span>
            <span>Oct</span>
            <span>Nov</span>
            <span>Déc</span>
          </div>
        </div>

        {/* Activité récente */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            <ClockIcon className="h-6 w-6 text-green-400 mr-2" />
            Activité Récente
          </h3>
          
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                  activity.status === 'success' ? 'bg-green-400' : 
                  activity.status === 'warning' ? 'bg-yellow-400' : 'bg-blue-400'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm">{activity.message}</p>
                  <p className="text-gray-400 text-xs">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-4 text-blue-400 text-sm hover:text-blue-300 transition-colors">
            Voir toute l'activité
          </button>
        </div>
      </div>

      {/* Métriques avancées */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6">
          <h4 className="text-white font-semibold mb-4 flex items-center">
            <FireIcon className="h-5 w-5 text-orange-400 mr-2" />
            Blog G-Maxing
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Articles publiés</span>
              <span className="text-white font-medium">{stats.blog.posts}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Vues totales</span>
              <span className="text-white font-medium">{stats.blog.totalViews.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Temps de lecture</span>
              <span className="text-white font-medium">{stats.blog.averageReadTime} min</span>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h4 className="text-white font-semibold mb-4 flex items-center">
            <HeartIcon className="h-5 w-5 text-red-400 mr-2" />
            Engagement
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Taux d'ouverture</span>
              <span className="text-white font-medium">{stats.newsletter.openRate.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Sessions coaching</span>
              <span className="text-white font-medium">{stats.coaching.completedSessions}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Conversion shop</span>
              <span className="text-white font-medium">{stats.shop.conversion}%</span>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h4 className="text-white font-semibold mb-4 flex items-center">
            <TrophyIcon className="h-5 w-5 text-yellow-400 mr-2" />
            Objectifs du Mois
          </h4>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-400 text-sm">Abonnés newsletter</span>
                <span className="text-white text-sm">85%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-green-400 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-400 text-sm">Revenus coaching</span>
                <span className="text-white text-sm">92%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-blue-400 h-2 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-400 text-sm">Articles publiés</span>
                <span className="text-white text-sm">67%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '67%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Gestion des Utilisateurs</h2>
        <button className="glass-btn-primary px-4 py-2 flex items-center space-x-2">
          <PlusIcon className="h-4 w-4" />
          <span>Ajouter Utilisateur</span>
        </button>
      </div>

      {/* Filtres rapides */}
      <div className="flex space-x-4">
        <button className="glass-btn-primary px-4 py-2 text-sm">Tous</button>
        <button className="glass-btn-secondary px-4 py-2 text-sm">Actifs</button>
        <button className="glass-btn-secondary px-4 py-2 text-sm">Premium</button>
        <button className="glass-btn-secondary px-4 py-2 text-sm">Nouveaux</button>
      </div>

      {/* Table des utilisateurs */}
      <div className="glass-card p-6 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left text-gray-400 font-medium py-3">Utilisateur</th>
              <th className="text-left text-gray-400 font-medium py-3">Status</th>
              <th className="text-left text-gray-400 font-medium py-3">Inscription</th>
              <th className="text-left text-gray-400 font-medium py-3">Dernière activité</th>
              <th className="text-right text-gray-400 font-medium py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {[
              { name: 'Marc Dubois', email: 'marc@example.com', status: 'Premium', joined: '12/03/2024', lastActive: '2h' },
              { name: 'Sarah Martin', email: 'sarah@example.com', status: 'Free', joined: '10/03/2024', lastActive: '5h' },
              { name: 'Antoine Rousseau', email: 'antoine@example.com', status: 'Premium', joined: '08/03/2024', lastActive: '1d' }
            ].map((user, index) => (
              <tr key={index} className="border-b border-white/5">
                <td className="py-4">
                  <div>
                    <div className="text-white font-medium">{user.name}</div>
                    <div className="text-gray-400 text-sm">{user.email}</div>
                  </div>
                </td>
                <td className="py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.status === 'Premium' 
                      ? 'bg-yellow-500/20 text-yellow-300' 
                      : 'bg-gray-500/20 text-gray-300'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="py-4 text-gray-300">{user.joined}</td>
                <td className="py-4 text-gray-300">{user.lastActive}</td>
                <td className="py-4">
                  <div className="flex items-center justify-end space-x-2">
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                      <EyeIcon className="h-4 w-4 text-gray-400" />
                    </button>
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                      <PencilIcon className="h-4 w-4 text-gray-400" />
                    </button>
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                      <TrashIcon className="h-4 w-4 text-red-400" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'users':
        return renderUsers();
      case 'newsletter':
        return (
          <div className="text-center py-12">
            <EnvelopeIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Gestion Newsletter</h3>
            <p className="text-gray-400">Gérez vos campagnes et abonnés newsletter ici.</p>
          </div>
        );
      case 'blog':
        return (
          <div className="text-center py-12">
            <DocumentTextIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Gestion Blog</h3>
            <p className="text-gray-400">Créez et gérez vos articles de blog G-Maxing.</p>
          </div>
        );
      case 'shop':
        return (
          <div className="text-center py-12">
            <ShoppingCartIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Gestion Boutique</h3>
            <p className="text-gray-400">Gérez vos produits et commandes.</p>
          </div>
        );
      case 'coaching':
        return (
          <div className="text-center py-12">
            <UserIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Gestion Coaching</h3>
            <p className="text-gray-400">Suivez vos clients et sessions de coaching.</p>
          </div>
        );
      case 'settings':
        return (
          <div className="text-center py-12">
            <CogIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Paramètres</h3>
            <p className="text-gray-400">Configurez votre plateforme G-Maxing.</p>
          </div>
        );
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Dashboard <span className="text-engel">G-Maxing</span>
              </h1>
              <p className="text-gray-300">
                Tableau de bord complet pour <span className="text-engel font-semibold">Engel Garcia Gomez</span>
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="glass-btn-secondary px-4 py-2">
                Exporter Données
              </button>
              <button className="glass-btn-primary px-4 py-2">
                Nouvelle Action
              </button>
            </div>
          </div>
        </div>

        {/* Navigation par onglets */}
        <div className="glass-card p-1 mb-8">
          <nav className="flex space-x-1">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <IconComponent className="h-5 w-5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Contenu principal */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminDashboard;
/**
 * Tableau de Bord Analytics G-Maxing
 * Dashboard complet d'intelligence d'affaires pour Engel Garcia Gomez
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  ChartBarIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  UserGroupIcon,
  BanknotesIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  StarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  CalendarIcon,
  GlobeAltIcon,
  AcademicCapIcon,
  FireIcon,
  BoltIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import { businessIntelligence } from '../../utils/analytics/businessIntelligence';

interface DashboardData {
  metrics: any;
  trends: any;
  topContent: any[];
  userInsights: any;
  marketingPerformance: any;
  recentActivity: any[];
  alerts: any[];
  kpis: any[];
}

interface AnalyticsDashboardProps {
  timeRange?: '7d' | '30d' | '90d' | '1y';
  className?: string;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  timeRange = '30d',
  className = ''
}) => {
  const { t } = useTranslation();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [predictiveData, setPredictiveData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'users' | 'content' | 'marketing' | 'predictions'>('overview');
  const [refreshCount, setRefreshCount] = useState(0);

  // Charger les données du dashboard
  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        console.log('📊 Chargement des données analytics...');
        
        // Simuler le chargement de données
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const data = businessIntelligence.getDashboardData();
        const predictions = businessIntelligence.generatePredictiveAnalytics();
        
        setDashboardData(data);
        setPredictiveData(predictions);
        
        console.log('✅ Données analytics chargées');
      } catch (error) {
        console.error('❌ Erreur chargement analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [timeRange, refreshCount]);

  // Actualiser les données
  const refreshData = () => {
    setRefreshCount(prev => prev + 1);
  };

  // Tabs de navigation
  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: ChartBarIcon },
    { id: 'users', label: 'Utilisateurs', icon: UserGroupIcon },
    { id: 'content', label: 'Contenu', icon: DocumentTextIcon },
    { id: 'marketing', label: 'Marketing', icon: GlobeAltIcon },
    { id: 'predictions', label: 'Prédictions', icon: BoltIcon }
  ];

  // Métriques principales
  const mainMetrics = useMemo(() => {
    if (!dashboardData) return [];
    
    return [
      {
        id: 'revenue',
        title: 'Revenus Total',
        value: dashboardData.metrics.totalRevenue,
        change: dashboardData.trends.revenue,
        format: 'currency',
        icon: BanknotesIcon,
        color: 'text-green-400'
      },
      {
        id: 'users',
        title: 'Utilisateurs Actifs',
        value: dashboardData.metrics.activeUsers,
        change: dashboardData.trends.users,
        format: 'number',
        icon: UserGroupIcon,
        color: 'text-blue-400'
      },
      {
        id: 'protocols',
        title: 'Protocoles Générés',
        value: dashboardData.metrics.protocolsGenerated,
        change: dashboardData.trends.protocols,
        format: 'number',
        icon: AcademicCapIcon,
        color: 'text-purple-400'
      },
      {
        id: 'engelSearches',
        title: 'Recherches "Engel Garcia Gomez"',
        value: dashboardData.metrics.engelGarciaGomezSearches,
        change: dashboardData.trends.engelGarciaGomezSearches,
        format: 'number',
        icon: MagnifyingGlassIcon,
        color: 'text-yellow-400'
      }
    ];
  }, [dashboardData]);

  // Formatage des valeurs
  const formatValue = (value: number, format: string): string => {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('fr-FR', { 
          style: 'currency', 
          currency: 'EUR',
          maximumFractionDigits: 0 
        }).format(value);
      case 'percentage':
        return `${value.toFixed(1)}%`;
      case 'number':
        return new Intl.NumberFormat('fr-FR').format(value);
      default:
        return value.toString();
    }
  };

  // Icône de tendance
  const getTrendIcon = (change: number) => {
    if (change > 0) return TrendingUpIcon;
    if (change < 0) return TrendingDownIcon;
    return ArrowPathIcon;
  };

  // Couleur de tendance
  const getTrendColor = (change: number) => {
    if (change > 0) return 'text-green-400';
    if (change < 0) return 'text-red-400';
    return 'text-gray-400';
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6 ${className}`}>
        <div className="max-w-7xl mx-auto">
          <div className="glass-card p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-white/20 border-t-blue-500 mx-auto mb-4" />
            <p className="text-white text-lg">Chargement des analytics G-Maxing...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6 ${className}`}>
        <div className="max-w-7xl mx-auto">
          <div className="glass-card p-8 text-center">
            <ExclamationTriangleIcon className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
            <p className="text-white text-lg">Impossible de charger les données analytics</p>
            <button
              onClick={refreshData}
              className="glass-btn-primary mt-4 px-6 py-2"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6 ${className}`}>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              📊 Analytics G-Maxing
            </h1>
            <p className="text-gray-300">
              Intelligence d'affaires pour <span className="text-engel font-semibold">Engel Garcia Gomez</span>
            </p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <CalendarIcon className="h-4 w-4" />
              <span>Derniers {timeRange === '7d' ? '7 jours' : timeRange === '30d' ? '30 jours' : timeRange === '90d' ? '90 jours' : '1 an'}</span>
            </div>
            
            <button
              onClick={refreshData}
              className="glass-btn-secondary px-4 py-2 flex items-center space-x-2"
            >
              <ArrowPathIcon className="h-4 w-4" />
              <span>Actualiser</span>
            </button>
          </div>
        </motion.div>

        {/* Alertes */}
        <AnimatePresence>
          {dashboardData.alerts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2"
            >
              {dashboardData.alerts.map((alert, index) => (
                <div
                  key={index}
                  className={`glass-card p-4 border-l-4 ${
                    alert.type === 'success' ? 'border-green-500 bg-green-500/10' :
                    alert.type === 'warning' ? 'border-yellow-500 bg-yellow-500/10' :
                    'border-red-500 bg-red-500/10'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {alert.type === 'success' && <CheckCircleIcon className="h-5 w-5 text-green-400" />}
                    {alert.type === 'warning' && <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />}
                    {alert.type === 'error' && <XCircleIcon className="h-5 w-5 text-red-400" />}
                    <span className="text-white">{alert.message}</span>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Métriques principales */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {mainMetrics.map((metric, index) => {
            const TrendIcon = getTrendIcon(metric.change);
            const Icon = metric.icon;
            
            return (
              <motion.div
                key={metric.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r from-white/10 to-white/5 ${metric.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className={`flex items-center space-x-1 ${getTrendColor(metric.change)}`}>
                    <TrendIcon className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {metric.change > 0 ? '+' : ''}{metric.change.toFixed(1)}%
                    </span>
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-1">
                  {formatValue(metric.value, metric.format)}
                </h3>
                <p className="text-gray-400 text-sm">{metric.title}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Navigation par onglets */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-2"
        >
          <div className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                    selectedTab === tab.id
                      ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-500/30'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Contenu des onglets */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {selectedTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* KPIs */}
                <div className="glass-card p-6">
                  <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                    <StarIcon className="h-6 w-6 text-yellow-400 mr-2" />
                    Indicateurs Clés
                  </h2>
                  <div className="space-y-4">
                    {dashboardData.kpis.map((kpi, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-gray-300">{kpi.name}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-white font-medium">
                            {formatValue(kpi.value, kpi.unit === '%' ? 'percentage' : kpi.unit === '€' ? 'currency' : 'number')}
                          </span>
                          <div className="w-20 bg-gray-700 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                kpi.value >= kpi.target ? 'bg-green-500' : 'bg-yellow-500'
                              }`}
                              style={{ width: `${Math.min(100, (kpi.value / kpi.target) * 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Activité récente */}
                <div className="glass-card p-6">
                  <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                    <EyeIcon className="h-6 w-6 text-blue-400 mr-2" />
                    Activité Récente
                  </h2>
                  <div className="space-y-4">
                    {dashboardData.recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                        <div className="w-2 h-2 bg-green-400 rounded-full" />
                        <div className="flex-1">
                          <p className="text-white text-sm">{activity.description}</p>
                          <p className="text-gray-400 text-xs">
                            {new Date(activity.timestamp).toLocaleString('fr-FR')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'users' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Insights utilisateur */}
                <div className="lg:col-span-2 glass-card p-6">
                  <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                    <UserGroupIcon className="h-6 w-6 text-blue-400 mr-2" />
                    Analyse Utilisateurs
                  </h2>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-4 bg-white/5 rounded-lg">
                      <div className="text-2xl font-bold text-white">{dashboardData.userInsights.totalUsers}</div>
                      <div className="text-sm text-gray-400">Total</div>
                    </div>
                    <div className="text-center p-4 bg-white/5 rounded-lg">
                      <div className="text-2xl font-bold text-green-400">{dashboardData.userInsights.newUsersThisMonth}</div>
                      <div className="text-sm text-gray-400">Nouveaux</div>
                    </div>
                    <div className="text-center p-4 bg-white/5 rounded-lg">
                      <div className="text-2xl font-bold text-purple-400">{dashboardData.userInsights.highEngagementUsers}</div>
                      <div className="text-sm text-gray-400">Très engagés</div>
                    </div>
                    <div className="text-center p-4 bg-white/5 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-400">{dashboardData.userInsights.averageProtocolsPerUser.toFixed(1)}</div>
                      <div className="text-sm text-gray-400">Protocoles/User</div>
                    </div>
                  </div>
                </div>

                {/* Segmentation utilisateur */}
                <div className="glass-card p-6">
                  <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                    <HeartIcon className="h-6 w-6 text-pink-400 mr-2" />
                    Segments
                  </h2>
                  <div className="space-y-4">
                    {Object.entries(dashboardData.userInsights.userSegments).map(([segment, count]) => (
                      <div key={segment} className="flex justify-between items-center">
                        <span className="text-gray-300 capitalize">{segment.replace(/([A-Z])/g, ' $1')}</span>
                        <span className="text-white font-medium">{count as number}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'content' && (
              <div className="glass-card p-6">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                  <DocumentTextIcon className="h-6 w-6 text-green-400 mr-2" />
                  Performance du Contenu
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left text-gray-400 pb-3">Contenu</th>
                        <th className="text-left text-gray-400 pb-3">Vues</th>
                        <th className="text-left text-gray-400 pb-3">Temps moyen</th>
                        <th className="text-left text-gray-400 pb-3">Taux rebond</th>
                        <th className="text-left text-gray-400 pb-3">Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData.topContent.map((content, index) => (
                        <tr key={content.id} className="border-b border-white/5">
                          <td className="py-4 text-white">{content.title}</td>
                          <td className="py-4 text-gray-300">{content.views}</td>
                          <td className="py-4 text-gray-300">{Math.round(content.averageTimeOnPage)}s</td>
                          <td className="py-4 text-gray-300">{(content.bounceRate * 100).toFixed(1)}%</td>
                          <td className="py-4">
                            <span className={`font-medium ${
                              content.engagementScore > 70 ? 'text-green-400' :
                              content.engagementScore > 40 ? 'text-yellow-400' : 'text-red-400'
                            }`}>
                              {content.engagementScore.toFixed(0)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {selectedTab === 'marketing' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Performance SEO */}
                <div className="glass-card p-6">
                  <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                    <MagnifyingGlassIcon className="h-6 w-6 text-purple-400 mr-2" />
                    Performance SEO
                  </h2>
                  
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-300">Score SEO Global</span>
                      <span className="text-white font-bold">{dashboardData.marketingPerformance.seoScore}/100</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full"
                        style={{ width: `${dashboardData.marketingPerformance.seoScore}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    {dashboardData.marketingPerformance.keywordRankings.slice(0, 5).map((keyword, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                        <div>
                          <div className="text-white font-medium">{keyword.keyword}</div>
                          <div className="text-gray-400 text-sm">Volume: {keyword.searchVolume}</div>
                        </div>
                        <div className={`text-lg font-bold px-3 py-1 rounded-full ${
                          keyword.position <= 3 ? 'bg-green-500/20 text-green-400' :
                          keyword.position <= 10 ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          #{keyword.position}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Opportunités */}
                <div className="glass-card p-6">
                  <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                    <FireIcon className="h-6 w-6 text-orange-400 mr-2" />
                    Opportunités Marketing
                  </h2>
                  
                  <div className="space-y-4">
                    {dashboardData.marketingPerformance.keywordOpportunities.map((opp, index) => (
                      <div key={index} className="p-4 bg-white/5 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-white font-medium">{opp.keyword}</h4>
                          <span className={`text-sm px-2 py-1 rounded ${
                            opp.opportunity > 80 ? 'bg-green-500/20 text-green-400' :
                            opp.opportunity > 60 ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {opp.opportunity}% opportunité
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span>Difficulté: {opp.difficulty}/100</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'predictions' && predictiveData && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Prévisions revenus */}
                <div className="glass-card p-6">
                  <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                    <BoltIcon className="h-6 w-6 text-yellow-400 mr-2" />
                    Prévision Revenus
                  </h2>
                  <div className="space-y-3">
                    {predictiveData.revenueForecast.slice(0, 4).map((forecast, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                        <span className="text-gray-300">{forecast.month}</span>
                        <div className="text-right">
                          <div className="text-white font-medium">
                            {formatValue(forecast.predictedRevenue, 'currency')}
                          </div>
                          <div className="text-gray-400 text-sm">
                            Confiance: {(forecast.confidence * 100).toFixed(0)}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommandations */}
                <div className="glass-card p-6">
                  <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                    <AcademicCapIcon className="h-6 w-6 text-blue-400 mr-2" />
                    Recommandations IA
                  </h2>
                  <div className="space-y-3">
                    {predictiveData.recommendedActions.map((action, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                        <p className="text-gray-300 text-sm">{action}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <StarIcon className="h-5 w-5 text-yellow-400" />
                      <span className="text-white font-medium">Score d'Opportunité</span>
                    </div>
                    <div className="text-2xl font-bold text-white">{predictiveData.opportunityScore}/100</div>
                    <div className="text-gray-400 text-sm mt-1">Potentiel de croissance élevé</div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
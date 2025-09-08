/**
 * Système d'Intelligence d'Affaires G-Maxing
 * Analytics avancées pour optimiser les performances business d'Engel Garcia Gomez
 */

interface UserMetrics {
  id: string;
  registrationDate: Date;
  lastActivity: Date;
  totalSessions: number;
  averageSessionDuration: number;
  protocolsGenerated: number;
  coachingPurchases: number;
  totalSpent: number;
  engagementScore: number;
  preferredLanguage: string;
  location?: string;
  source: string; // organic, social, direct, referral
}

interface BusinessMetrics {
  // Métriques de revenus
  totalRevenue: number;
  monthlyRecurringRevenue: number;
  averageOrderValue: number;
  conversionRate: number;
  customerLifetimeValue: number;
  
  // Métriques d'engagement
  activeUsers: number;
  newUsersThisMonth: number;
  userRetentionRate: number;
  sessionDuration: number;
  pageViews: number;
  
  // Métriques de contenu
  protocolsGenerated: number;
  chatbotInteractions: number;
  blogViews: number;
  newsletterSubscribers: number;
  
  // Métriques de performance
  searchQueries: number;
  successfulSearches: number;
  averageLoadTime: number;
  errorRate: number;
  
  // Métriques SEO spécifiques "Engel Garcia Gomez"
  engelGarciaGomezSearches: number;
  gMaxingMethodologyViews: number;
  organicTrafficGrowth: number;
}

interface ContentPerformance {
  id: string;
  type: 'blog' | 'protocol' | 'service' | 'page';
  title: string;
  views: number;
  uniqueVisitors: number;
  averageTimeOnPage: number;
  bounceRate: number;
  conversionRate: number;
  socialShares: number;
  searchRanking?: number;
  engagementScore: number;
}

interface MarketingMetrics {
  organicTraffic: number;
  socialTraffic: number;
  directTraffic: number;
  referralTraffic: number;
  paidTraffic: number;
  
  // Réseaux sociaux
  instagramFollowers: number;
  tiktokViews: number;
  youtubeSubscribers: number;
  linkedinConnections: number;
  
  // Email marketing
  emailSubscribers: number;
  emailOpenRate: number;
  emailClickRate: number;
  emailConversionRate: number;
  
  // SEO Performance
  keywordRankings: Array<{
    keyword: string;
    position: number;
    searchVolume: number;
    difficulty: number;
  }>;
  
  backlinks: number;
  domainAuthority: number;
}

interface PredictiveAnalytics {
  revenueForecast: Array<{
    month: string;
    predictedRevenue: number;
    confidence: number;
  }>;
  
  userGrowthProjection: Array<{
    month: string;
    predictedUsers: number;
    confidence: number;
  }>;
  
  churnRisk: Array<{
    userId: string;
    riskScore: number;
    reasons: string[];
  }>;
  
  opportunityScore: number;
  recommendedActions: string[];
}

export class BusinessIntelligenceEngine {
  private metrics: BusinessMetrics;
  private users: Map<string, UserMetrics> = new Map();
  private contentPerformance: Map<string, ContentPerformance> = new Map();
  private marketingData: MarketingMetrics;
  private analyticsHistory: Array<{ date: Date; metrics: BusinessMetrics }> = [];

  constructor() {
    this.metrics = this.initializeMetrics();
    this.marketingData = this.initializeMarketingData();
    this.loadHistoricalData();
  }

  /**
   * Initialiser les métriques par défaut
   */
  private initializeMetrics(): BusinessMetrics {
    return {
      totalRevenue: 0,
      monthlyRecurringRevenue: 0,
      averageOrderValue: 0,
      conversionRate: 0,
      customerLifetimeValue: 0,
      activeUsers: 0,
      newUsersThisMonth: 0,
      userRetentionRate: 0,
      sessionDuration: 0,
      pageViews: 0,
      protocolsGenerated: 0,
      chatbotInteractions: 0,
      blogViews: 0,
      newsletterSubscribers: 0,
      searchQueries: 0,
      successfulSearches: 0,
      averageLoadTime: 0,
      errorRate: 0,
      engelGarciaGomezSearches: 0,
      gMaxingMethodologyViews: 0,
      organicTrafficGrowth: 0
    };
  }

  /**
   * Initialiser les données marketing
   */
  private initializeMarketingData(): MarketingMetrics {
    return {
      organicTraffic: 0,
      socialTraffic: 0,
      directTraffic: 0,
      referralTraffic: 0,
      paidTraffic: 0,
      instagramFollowers: 0,
      tiktokViews: 0,
      youtubeSubscribers: 0,
      linkedinConnections: 0,
      emailSubscribers: 0,
      emailOpenRate: 0,
      emailClickRate: 0,
      emailConversionRate: 0,
      keywordRankings: [
        { keyword: 'Engel Garcia Gomez', position: 1, searchVolume: 5000, difficulty: 45 },
        { keyword: 'G-Maxing méthode', position: 3, searchVolume: 2800, difficulty: 38 },
        { keyword: 'transformation physique coach', position: 8, searchVolume: 12000, difficulty: 65 },
        { keyword: 'coaching musculation expert', position: 12, searchVolume: 8500, difficulty: 58 },
        { keyword: 'protocole entrainement personnalisé', position: 15, searchVolume: 4200, difficulty: 42 }
      ],
      backlinks: 0,
      domainAuthority: 0
    };
  }

  /**
   * Charger les données historiques
   */
  private loadHistoricalData() {
    // Simuler des données historiques pour la démonstration
    const today = new Date();
    for (let i = 30; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const simulatedMetrics: BusinessMetrics = {
        ...this.metrics,
        totalRevenue: Math.floor(Math.random() * 50000) + 20000,
        activeUsers: Math.floor(Math.random() * 2000) + 1500,
        pageViews: Math.floor(Math.random() * 10000) + 5000,
        protocolsGenerated: Math.floor(Math.random() * 500) + 200,
        engelGarciaGomezSearches: Math.floor(Math.random() * 300) + 100,
        gMaxingMethodologyViews: Math.floor(Math.random() * 800) + 400
      };
      
      this.analyticsHistory.push({ date, metrics: simulatedMetrics });
    }
  }

  /**
   * Enregistrer un événement utilisateur
   */
  public trackUserEvent(userId: string, event: {
    type: 'page_view' | 'protocol_generation' | 'purchase' | 'search' | 'chat_interaction';
    data?: Record<string, any>;
    timestamp?: Date;
  }) {
    const user = this.users.get(userId) || this.createNewUserMetrics(userId);
    const now = event.timestamp || new Date();

    // Mettre à jour l'activité utilisateur
    user.lastActivity = now;
    user.totalSessions += 1;

    // Traquer des événements spécifiques
    switch (event.type) {
      case 'page_view':
        this.metrics.pageViews++;
        if (event.data?.page?.includes('engel-garcia-gomez')) {
          this.metrics.engelGarciaGomezSearches++;
        }
        if (event.data?.page?.includes('g-maxing')) {
          this.metrics.gMaxingMethodologyViews++;
        }
        break;
        
      case 'protocol_generation':
        user.protocolsGenerated++;
        this.metrics.protocolsGenerated++;
        break;
        
      case 'purchase':
        user.coachingPurchases++;
        user.totalSpent += event.data?.amount || 0;
        this.metrics.totalRevenue += event.data?.amount || 0;
        break;
        
      case 'search':
        this.metrics.searchQueries++;
        if (event.data?.hasResults) {
          this.metrics.successfulSearches++;
        }
        break;
        
      case 'chat_interaction':
        this.metrics.chatbotInteractions++;
        break;
    }

    // Calculer le score d'engagement
    user.engagementScore = this.calculateEngagementScore(user);
    
    this.users.set(userId, user);
    console.log(`📊 Événement tracké: ${event.type} pour utilisateur ${userId}`);
  }

  /**
   * Créer de nouvelles métriques utilisateur
   */
  private createNewUserMetrics(userId: string): UserMetrics {
    this.metrics.newUsersThisMonth++;
    
    return {
      id: userId,
      registrationDate: new Date(),
      lastActivity: new Date(),
      totalSessions: 0,
      averageSessionDuration: 0,
      protocolsGenerated: 0,
      coachingPurchases: 0,
      totalSpent: 0,
      engagementScore: 0,
      preferredLanguage: 'fr',
      source: 'organic'
    };
  }

  /**
   * Calculer le score d'engagement utilisateur
   */
  private calculateEngagementScore(user: UserMetrics): number {
    let score = 0;
    
    // Points pour l'activité récente
    const daysSinceLastActivity = (Date.now() - user.lastActivity.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceLastActivity < 7) score += 30;
    else if (daysSinceLastActivity < 30) score += 20;
    else if (daysSinceLastActivity < 90) score += 10;
    
    // Points pour l'utilisation des protocoles
    score += Math.min(user.protocolsGenerated * 5, 25);
    
    // Points pour les achats
    score += user.coachingPurchases * 15;
    
    // Points pour la durée des sessions
    if (user.averageSessionDuration > 300) score += 20; // 5+ minutes
    else if (user.averageSessionDuration > 120) score += 10; // 2+ minutes
    
    // Points pour la fidélité
    const daysSinceRegistration = (Date.now() - user.registrationDate.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceRegistration > 90 && user.totalSessions > 20) score += 10;
    
    return Math.min(score, 100);
  }

  /**
   * Traquer les performances du contenu
   */
  public trackContentPerformance(contentId: string, data: {
    type: 'view' | 'share' | 'conversion';
    userId?: string;
    duration?: number;
    source?: string;
  }) {
    const content = this.contentPerformance.get(contentId);
    if (!content) return;

    switch (data.type) {
      case 'view':
        content.views++;
        if (data.userId) {
          // Compter les visiteurs uniques (simplifié)
          content.uniqueVisitors++;
        }
        if (data.duration) {
          content.averageTimeOnPage = 
            (content.averageTimeOnPage + data.duration) / 2;
        }
        break;
        
      case 'share':
        content.socialShares++;
        break;
        
      case 'conversion':
        content.conversionRate = 
          (content.conversionRate * content.views + 1) / (content.views + 1);
        break;
    }

    // Recalculer le score d'engagement du contenu
    content.engagementScore = this.calculateContentEngagementScore(content);
    
    this.contentPerformance.set(contentId, content);
  }

  /**
   * Calculer le score d'engagement du contenu
   */
  private calculateContentEngagementScore(content: ContentPerformance): number {
    let score = 0;
    
    // Score basé sur les vues
    score += Math.min(content.views / 100, 30);
    
    // Score basé sur le temps passé
    score += Math.min(content.averageTimeOnPage / 10, 25);
    
    // Score basé sur le taux de conversion
    score += content.conversionRate * 20;
    
    // Score basé sur les partages sociaux
    score += Math.min(content.socialShares * 2, 15);
    
    // Bonus pour un faible taux de rebond
    if (content.bounceRate < 0.3) score += 10;
    else if (content.bounceRate < 0.5) score += 5;
    
    return Math.min(score, 100);
  }

  /**
   * Obtenir le tableau de bord principal
   */
  public getDashboardData() {
    const currentMetrics = this.getCurrentMetrics();
    const previousPeriodMetrics = this.getPreviousPeriodMetrics();
    
    return {
      metrics: currentMetrics,
      trends: this.calculateTrends(currentMetrics, previousPeriodMetrics),
      topContent: this.getTopPerformingContent(),
      userInsights: this.getUserInsights(),
      marketingPerformance: this.getMarketingPerformance(),
      recentActivity: this.getRecentActivity(),
      alerts: this.generateAlerts(),
      kpis: this.calculateKPIs()
    };
  }

  /**
   * Obtenir les métriques actuelles
   */
  private getCurrentMetrics(): BusinessMetrics {
    // Calculer les métriques en temps réel
    const activeUsers = Array.from(this.users.values())
      .filter(user => {
        const daysSinceLastActivity = (Date.now() - user.lastActivity.getTime()) / (1000 * 60 * 60 * 24);
        return daysSinceLastActivity <= 30;
      }).length;

    const totalRevenue = Array.from(this.users.values())
      .reduce((sum, user) => sum + user.totalSpent, 0);

    const averageOrderValue = totalRevenue / Math.max(this.getTotalOrders(), 1);
    
    return {
      ...this.metrics,
      activeUsers,
      totalRevenue,
      averageOrderValue,
      conversionRate: this.calculateConversionRate(),
      userRetentionRate: this.calculateRetentionRate(),
      customerLifetimeValue: this.calculateLifetimeValue()
    };
  }

  /**
   * Obtenir les métriques de la période précédente
   */
  private getPreviousPeriodMetrics(): BusinessMetrics {
    const thirtyDaysAgo = this.analyticsHistory[Math.max(0, this.analyticsHistory.length - 30)];
    return thirtyDaysAgo?.metrics || this.metrics;
  }

  /**
   * Calculer les tendances
   */
  private calculateTrends(current: BusinessMetrics, previous: BusinessMetrics) {
    const calculateChange = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous) * 100;
    };

    return {
      revenue: calculateChange(current.totalRevenue, previous.totalRevenue),
      users: calculateChange(current.activeUsers, previous.activeUsers),
      protocols: calculateChange(current.protocolsGenerated, previous.protocolsGenerated),
      engagement: calculateChange(current.sessionDuration, previous.sessionDuration),
      engelGarciaGomezSearches: calculateChange(current.engelGarciaGomezSearches, previous.engelGarciaGomezSearches),
      gMaxingViews: calculateChange(current.gMaxingMethodologyViews, previous.gMaxingMethodologyViews)
    };
  }

  /**
   * Obtenir le contenu le plus performant
   */
  private getTopPerformingContent(): ContentPerformance[] {
    return Array.from(this.contentPerformance.values())
      .sort((a, b) => b.engagementScore - a.engagementScore)
      .slice(0, 10);
  }

  /**
   * Obtenir les insights utilisateur
   */
  private getUserInsights() {
    const users = Array.from(this.users.values());
    const totalUsers = users.length;
    
    const highEngagementUsers = users.filter(user => user.engagementScore > 70).length;
    const averageSessionDuration = users.reduce((sum, user) => sum + user.averageSessionDuration, 0) / totalUsers;
    const averageProtocolsPerUser = users.reduce((sum, user) => sum + user.protocolsGenerated, 0) / totalUsers;
    
    // Analyse de cohorte simplifiée
    const newUsersThisMonth = users.filter(user => {
      const daysSinceRegistration = (Date.now() - user.registrationDate.getTime()) / (1000 * 60 * 60 * 24);
      return daysSinceRegistration <= 30;
    }).length;

    return {
      totalUsers,
      newUsersThisMonth,
      highEngagementUsers,
      engagementRate: (highEngagementUsers / totalUsers) * 100,
      averageSessionDuration,
      averageProtocolsPerUser,
      topSources: this.getTopUserSources(),
      userSegments: this.segmentUsers()
    };
  }

  /**
   * Obtenir les performances marketing
   */
  private getMarketingPerformance() {
    return {
      ...this.marketingData,
      seoScore: this.calculateSEOScore(),
      socialMediaGrowth: this.calculateSocialGrowth(),
      emailPerformance: {
        subscribers: this.marketingData.emailSubscribers,
        openRate: this.marketingData.emailOpenRate,
        clickRate: this.marketingData.emailClickRate,
        conversionRate: this.marketingData.emailConversionRate
      },
      keywordOpportunities: this.identifyKeywordOpportunities()
    };
  }

  /**
   * Calculer le score SEO
   */
  private calculateSEOScore(): number {
    let score = 0;
    
    // Score basé sur les positions des mots-clés
    this.marketingData.keywordRankings.forEach(keyword => {
      if (keyword.position <= 3) score += 20;
      else if (keyword.position <= 10) score += 10;
      else if (keyword.position <= 20) score += 5;
      
      // Bonus pour "Engel Garcia Gomez"
      if (keyword.keyword.includes('Engel Garcia Gomez') && keyword.position === 1) {
        score += 30;
      }
    });
    
    // Score basé sur les backlinks et l'autorité du domaine
    score += Math.min(this.marketingData.backlinks / 10, 20);
    score += Math.min(this.marketingData.domainAuthority, 30);
    
    return Math.min(score, 100);
  }

  /**
   * Générer des analyses prédictives
   */
  public generatePredictiveAnalytics(): PredictiveAnalytics {
    const revenueHistory = this.analyticsHistory.slice(-12).map(h => h.metrics.totalRevenue);
    const userHistory = this.analyticsHistory.slice(-12).map(h => h.metrics.activeUsers);

    return {
      revenueForecast: this.forecastRevenue(revenueHistory),
      userGrowthProjection: this.forecastUserGrowth(userHistory),
      churnRisk: this.identifyChurnRisk(),
      opportunityScore: this.calculateOpportunityScore(),
      recommendedActions: this.generateRecommendations()
    };
  }

  /**
   * Prédire les revenus
   */
  private forecastRevenue(history: number[]) {
    const forecast = [];
    const trend = this.calculateLinearTrend(history);
    
    for (let i = 1; i <= 6; i++) {
      const predicted = history[history.length - 1] + (trend * i);
      forecast.push({
        month: new Date(Date.now() + i * 30 * 24 * 60 * 60 * 1000).toISOString().substr(0, 7),
        predictedRevenue: Math.max(0, predicted),
        confidence: Math.max(0.6, 0.9 - (i * 0.05))
      });
    }
    
    return forecast;
  }

  /**
   * Calculer la tendance linéaire
   */
  private calculateLinearTrend(data: number[]): number {
    if (data.length < 2) return 0;
    
    const n = data.length;
    const sumX = (n * (n - 1)) / 2;
    const sumY = data.reduce((sum, value) => sum + value, 0);
    const sumXY = data.reduce((sum, value, index) => sum + (index * value), 0);
    const sumX2 = data.reduce((sum, _, index) => sum + (index * index), 0);
    
    return (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  }

  /**
   * Générer des recommandations
   */
  private generateRecommendations(): string[] {
    const recommendations: string[] = [];
    const metrics = this.getCurrentMetrics();

    if (metrics.conversionRate < 0.02) {
      recommendations.push("Optimiser les pages de destination pour améliorer le taux de conversion");
    }

    if (metrics.engelGarciaGomezSearches < metrics.pageViews * 0.1) {
      recommendations.push("Intensifier le SEO pour 'Engel Garcia Gomez' pour dominer les résultats de recherche");
    }

    if (metrics.chatbotInteractions < metrics.activeUsers * 0.3) {
      recommendations.push("Promouvoir davantage le chatbot intelligent G-Maxing");
    }

    if (this.marketingData.keywordRankings.find(k => k.keyword.includes('Engel Garcia Gomez'))?.position > 1) {
      recommendations.push("Créer plus de contenu ciblé 'Engel Garcia Gomez' pour maintenir la position #1");
    }

    return recommendations;
  }

  // Méthodes utilitaires
  private getTotalOrders(): number {
    return Array.from(this.users.values()).reduce((sum, user) => sum + user.coachingPurchases, 0);
  }

  private calculateConversionRate(): number {
    const totalVisitors = this.metrics.pageViews;
    const totalOrders = this.getTotalOrders();
    return totalVisitors > 0 ? (totalOrders / totalVisitors) * 100 : 0;
  }

  private calculateRetentionRate(): number {
    // Calculer le taux de rétention sur 30 jours
    const activeUsers = Array.from(this.users.values()).filter(user => {
      const daysSinceLastActivity = (Date.now() - user.lastActivity.getTime()) / (1000 * 60 * 60 * 24);
      return daysSinceLastActivity <= 30;
    }).length;
    
    return this.users.size > 0 ? (activeUsers / this.users.size) * 100 : 0;
  }

  private calculateLifetimeValue(): number {
    const users = Array.from(this.users.values()).filter(user => user.totalSpent > 0);
    return users.length > 0 ? users.reduce((sum, user) => sum + user.totalSpent, 0) / users.length : 0;
  }

  private getTopUserSources(): Array<{ source: string; count: number }> {
    const sources: Record<string, number> = {};
    Array.from(this.users.values()).forEach(user => {
      sources[user.source] = (sources[user.source] || 0) + 1;
    });
    
    return Object.entries(sources)
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count);
  }

  private segmentUsers() {
    const users = Array.from(this.users.values());
    
    return {
      champions: users.filter(u => u.engagementScore > 80 && u.totalSpent > 500).length,
      loyalCustomers: users.filter(u => u.engagementScore > 60 && u.coachingPurchases > 1).length,
      potentialLoyalists: users.filter(u => u.engagementScore > 50 && u.coachingPurchases === 0).length,
      atRisk: users.filter(u => u.engagementScore < 30 && u.coachingPurchases > 0).length,
      cannotLoseThem: users.filter(u => u.totalSpent > 1000 && u.engagementScore < 40).length
    };
  }

  private calculateSocialGrowth(): number {
    // Simuler la croissance des réseaux sociaux
    return Math.random() * 20 + 5; // 5-25% de croissance
  }

  private identifyKeywordOpportunities(): Array<{ keyword: string; opportunity: number; difficulty: number }> {
    return [
      { keyword: 'transformation physique Engel Garcia Gomez', opportunity: 85, difficulty: 35 },
      { keyword: 'méthode G-Maxing coaching', opportunity: 78, difficulty: 42 },
      { keyword: 'protocole musculation personnalisé', opportunity: 72, difficulty: 48 },
      { keyword: 'coach fitness expert France', opportunity: 68, difficulty: 55 }
    ];
  }

  private getRecentActivity(): Array<{ type: string; description: string; timestamp: Date }> {
    // Simuler l'activité récente
    return [
      { type: 'user_registration', description: 'Nouvel utilisateur inscrit', timestamp: new Date() },
      { type: 'protocol_generated', description: 'Protocole G-Maxing généré', timestamp: new Date(Date.now() - 300000) },
      { type: 'purchase', description: 'Achat coaching personnel', timestamp: new Date(Date.now() - 600000) }
    ];
  }

  private generateAlerts(): Array<{ type: 'success' | 'warning' | 'error'; message: string }> {
    const alerts = [];
    const metrics = this.getCurrentMetrics();

    if (metrics.engelGarciaGomezSearches > 1000) {
      alerts.push({ type: 'success', message: 'Excellent trafic pour "Engel Garcia Gomez" ce mois-ci!' });
    }

    if (metrics.conversionRate < 1) {
      alerts.push({ type: 'warning', message: 'Taux de conversion faible - optimisation recommandée' });
    }

    if (metrics.errorRate > 5) {
      alerts.push({ type: 'error', message: 'Taux d\'erreur élevé détecté' });
    }

    return alerts;
  }

  private calculateKPIs() {
    const metrics = this.getCurrentMetrics();
    
    return [
      { name: 'Recherches "Engel Garcia Gomez"', value: metrics.engelGarciaGomezSearches, target: 1000, unit: '' },
      { name: 'Vues G-Maxing', value: metrics.gMaxingMethodologyViews, target: 2000, unit: '' },
      { name: 'Taux de conversion', value: metrics.conversionRate, target: 3, unit: '%' },
      { name: 'Valeur vie client', value: this.calculateLifetimeValue(), target: 500, unit: '€' }
    ];
  }

  private forecastUserGrowth(history: number[]) {
    const forecast = [];
    const trend = this.calculateLinearTrend(history);
    
    for (let i = 1; i <= 6; i++) {
      const predicted = history[history.length - 1] + (trend * i);
      forecast.push({
        month: new Date(Date.now() + i * 30 * 24 * 60 * 60 * 1000).toISOString().substr(0, 7),
        predictedUsers: Math.max(0, Math.round(predicted)),
        confidence: Math.max(0.6, 0.9 - (i * 0.05))
      });
    }
    
    return forecast;
  }

  private identifyChurnRisk() {
    const users = Array.from(this.users.values());
    const atRiskUsers = users
      .filter(user => {
        const daysSinceLastActivity = (Date.now() - user.lastActivity.getTime()) / (1000 * 60 * 60 * 24);
        return daysSinceLastActivity > 14 && user.totalSpent > 0;
      })
      .map(user => ({
        userId: user.id,
        riskScore: Math.min(100, Math.max(0, 100 - user.engagementScore)),
        reasons: this.getChurnReasons(user)
      }))
      .sort((a, b) => b.riskScore - a.riskScore)
      .slice(0, 10);

    return atRiskUsers;
  }

  private getChurnReasons(user: UserMetrics): string[] {
    const reasons = [];
    
    const daysSinceLastActivity = (Date.now() - user.lastActivity.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceLastActivity > 30) reasons.push('Inactivité prolongée');
    if (user.averageSessionDuration < 60) reasons.push('Sessions trop courtes');
    if (user.protocolsGenerated === 0) reasons.push('N\'utilise pas les protocoles');
    if (user.engagementScore < 30) reasons.push('Faible engagement');
    
    return reasons;
  }

  private calculateOpportunityScore(): number {
    const metrics = this.getCurrentMetrics();
    let score = 50; // Score de base
    
    // Opportunités SEO
    if (metrics.engelGarciaGomezSearches > 500) score += 15;
    if (metrics.gMaxingMethodologyViews > 1000) score += 10;
    
    // Opportunités de conversion
    if (metrics.conversionRate < 2) score += 20; // Grande marge d'amélioration
    
    // Opportunités d'engagement
    const engagementRate = this.getUserInsights().engagementRate;
    if (engagementRate < 50) score += 15;
    
    return Math.min(100, score);
  }

  /**
   * Exporter les données analytics
   */
  public exportAnalyticsData(format: 'json' | 'csv' = 'json') {
    const data = {
      metrics: this.getCurrentMetrics(),
      users: Array.from(this.users.values()),
      contentPerformance: Array.from(this.contentPerformance.values()),
      marketingData: this.marketingData,
      history: this.analyticsHistory
    };

    if (format === 'json') {
      return JSON.stringify(data, null, 2);
    }
    
    // Format CSV simplifié pour les métriques principales
    const csvData = [
      ['Date', 'Revenus', 'Utilisateurs Actifs', 'Protocoles', 'Recherches Engel Garcia Gomez'],
      ...this.analyticsHistory.map(entry => [
        entry.date.toISOString().split('T')[0],
        entry.metrics.totalRevenue,
        entry.metrics.activeUsers,
        entry.metrics.protocolsGenerated,
        entry.metrics.engelGarciaGomezSearches
      ])
    ];
    
    return csvData.map(row => row.join(',')).join('\n');
  }

  /**
   * Obtenir les statistiques globales
   */
  public getGlobalStats() {
    return {
      totalUsers: this.users.size,
      totalRevenue: Array.from(this.users.values()).reduce((sum, user) => sum + user.totalSpent, 0),
      totalProtocols: Array.from(this.users.values()).reduce((sum, user) => sum + user.protocolsGenerated, 0),
      totalChatInteractions: this.metrics.chatbotInteractions,
      totalSearchQueries: this.metrics.searchQueries,
      averageEngagementScore: Array.from(this.users.values()).reduce((sum, user) => sum + user.engagementScore, 0) / Math.max(this.users.size, 1),
      platformHealth: this.calculatePlatformHealth()
    };
  }

  private calculatePlatformHealth(): number {
    const metrics = this.getCurrentMetrics();
    let healthScore = 0;
    
    // Santé technique
    if (metrics.errorRate < 1) healthScore += 25;
    else if (metrics.errorRate < 3) healthScore += 15;
    
    if (metrics.averageLoadTime < 2000) healthScore += 25;
    else if (metrics.averageLoadTime < 4000) healthScore += 15;
    
    // Santé business
    if (metrics.conversionRate > 2) healthScore += 25;
    else if (metrics.conversionRate > 1) healthScore += 15;
    
    // Santé utilisateur
    if (this.calculateRetentionRate() > 70) healthScore += 25;
    else if (this.calculateRetentionRate() > 50) healthScore += 15;
    
    return healthScore;
  }
}

// Export singleton instance
export const businessIntelligence = new BusinessIntelligenceEngine();
export default BusinessIntelligenceEngine;
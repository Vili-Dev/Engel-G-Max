/**
 * Moteur Newsletter G-Maxing
 * Système d'automatisation newsletter avec SendGrid pour Engel Garcia Gomez
 */

// Note: Firebase integration disabled - using local storage for demo
// import { db } from '../firebase/firebase';

// Types et interfaces
export interface NewsletterSubscriber {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  preferences: {
    gMaxing: boolean;
    engelGarciaGomez: boolean;
    transformation: boolean;
    entrainement: boolean;
    nutrition: boolean;
  };
  status: 'pending' | 'confirmed' | 'unsubscribed' | 'bounced';
  subscribedAt: Date;
  confirmedAt?: Date;
  lastEmailSent?: Date;
  tags: string[];
  source: 'blog' | 'homepage' | 'coaching' | 'shop' | 'social';
  language: 'fr' | 'en' | 'es';
  sendgridContactId?: string;
  metadata: {
    ip?: string;
    userAgent?: string;
    referrer?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
  };
}

export interface NewsletterTemplate {
  id: string;
  name: string;
  subject: string;
  htmlContent: string;
  textContent: string;
  type: 'welcome' | 'weekly' | 'promotion' | 'update' | 'gmax-special';
  language: 'fr' | 'en' | 'es';
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  sendgridTemplateId?: string;
  isActive: boolean;
}

export interface NewsletterCampaign {
  id: string;
  name: string;
  subject: string;
  templateId: string;
  targetAudience: {
    tags?: string[];
    preferences?: string[];
    status?: string[];
    language?: string[];
    subscribedAfter?: Date;
    subscribedBefore?: Date;
  };
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';
  scheduledAt?: Date;
  sentAt?: Date;
  stats: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    bounced: number;
    unsubscribed: number;
  };
  sendgridCampaignId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NewsletterAutomation {
  id: string;
  name: string;
  trigger: 'subscription' | 'tag_added' | 'purchase' | 'inactivity' | 'anniversary';
  conditions: Record<string, any>;
  actions: Array<{
    type: 'send_email' | 'add_tag' | 'remove_tag' | 'update_preference' | 'wait';
    templateId?: string;
    tagName?: string;
    preference?: string;
    waitDays?: number;
    delay?: number; // en minutes
  }>;
  isActive: boolean;
  createdAt: Date;
  lastExecuted?: Date;
  executionCount: number;
}

class NewsletterEngine {
  private apiKey: string = import.meta.env.VITE_SENDGRID_API_KEY || 'demo_key';
  private fromEmail: string = 'contact@engelgmax.com';
  private fromName: string = 'Engel Garcia Gomez - G-Maxing';
  
  constructor() {
    console.log('🚀 Newsletter Engine initialisé');
  }

  // ============= GESTION DES ABONNÉS =============

  /**
   * Ajouter un nouvel abonné
   */
  async subscribe(
    email: string, 
    options: {
      firstName?: string;
      lastName?: string;
      source?: string;
      language?: string;
      preferences?: Partial<NewsletterSubscriber['preferences']>;
      metadata?: Partial<NewsletterSubscriber['metadata']>;
    } = {}
  ): Promise<{ success: boolean; subscriberId?: string; message: string }> {
    try {
      // Vérifier si l'email existe déjà
      const existingSubscriber = await this.getSubscriberByEmail(email);
      
      if (existingSubscriber) {
        if (existingSubscriber.status === 'unsubscribed') {
          // Réactiver l'abonnement
          await this.reactivateSubscriber(existingSubscriber.id);
          return {
            success: true,
            subscriberId: existingSubscriber.id,
            message: 'Abonnement réactivé avec succès !'
          };
        } else {
          return {
            success: false,
            message: 'Cette adresse email est déjà abonnée.'
          };
        }
      }

      // Créer un nouvel abonné
      const subscriber: Omit<NewsletterSubscriber, 'id'> = {
        email: email.toLowerCase().trim(),
        firstName: options.firstName?.trim(),
        lastName: options.lastName?.trim(),
        preferences: {
          gMaxing: true,
          engelGarciaGomez: true,
          transformation: options.preferences?.transformation ?? true,
          entrainement: options.preferences?.entrainement ?? true,
          nutrition: options.preferences?.nutrition ?? true,
        },
        status: 'pending', // Nécessite confirmation email
        subscribedAt: new Date(),
        tags: this.generateInitialTags(options.source, options.preferences),
        source: (options.source as any) || 'blog',
        language: (options.language as any) || 'fr',
        metadata: {
          ...options.metadata,
          subscribedAt: new Date().toISOString()
        }
      };

      // Sauvegarder localement (démo - remplacer par vraie DB)
      const subscriberId = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const subscriberData = {
        id: subscriberId,
        ...subscriber,
        subscribedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Stocker en localStorage pour la démo
      const existingData = localStorage.getItem('newsletter_subscribers') || '[]';
      const subscribers = JSON.parse(existingData);
      subscribers.push(subscriberData);
      localStorage.setItem('newsletter_subscribers', JSON.stringify(subscribers));

      // Ajouter à SendGrid (simulé)
      const sendgridContactId = await this.addToSendGrid(subscriber);

      // Envoyer email de confirmation (simulé)
      await this.sendConfirmationEmail(subscriberId);

      // Déclencher l'automation de bienvenue (simulé)
      await this.triggerAutomation('subscription', { subscriberId });

      console.log('✅ Nouvel abonné ajouté:', email);
      
      return {
        success: true,
        subscriberId: subscriberId,
        message: 'Abonnement enregistré ! Vérifiez votre email pour confirmer.'
      };

    } catch (error) {
      console.error('❌ Erreur lors de l\'abonnement:', error);
      return {
        success: false,
        message: 'Une erreur est survenue lors de l\'abonnement.'
      };
    }
  }

  /**
   * Confirmer un abonnement
   */
  async confirmSubscription(subscriberId: string, token: string): Promise<boolean> {
    try {
      const subscriber = await this.getSubscriberById(subscriberId);
      if (!subscriber || subscriber.status !== 'pending') {
        return false;
      }

      // Vérifier le token (en production, utiliser JWT)
      const expectedToken = this.generateConfirmationToken(subscriberId);
      if (token !== expectedToken) {
        return false;
      }

      // Marquer comme confirmé (localStorage pour la démo)
      const existingData = localStorage.getItem('newsletter_subscribers') || '[]';
      const subscribers = JSON.parse(existingData);
      const subscriberIndex = subscribers.findIndex((s: any) => s.id === subscriberId);
      if (subscriberIndex !== -1) {
        subscribers[subscriberIndex].status = 'confirmed';
        subscribers[subscriberIndex].confirmedAt = new Date();
        subscribers[subscriberIndex].updatedAt = new Date();
        localStorage.setItem('newsletter_subscribers', JSON.stringify(subscribers));
      }

      // Mettre à jour SendGrid
      await this.updateSendGridContact(subscriber.sendgridContactId!, { status: 'confirmed' });

      console.log('✅ Abonnement confirmé:', subscriberId);
      return true;

    } catch (error) {
      console.error('❌ Erreur lors de la confirmation:', error);
      return false;
    }
  }

  /**
   * Se désabonner
   */
  async unsubscribe(email: string, reason?: string): Promise<boolean> {
    try {
      const subscriber = await this.getSubscriberByEmail(email);
      if (!subscriber) return false;

      await updateDoc(doc(db, 'newsletter_subscribers', subscriber.id), {
        status: 'unsubscribed',
        unsubscribedAt: serverTimestamp(),
        unsubscribeReason: reason,
        updatedAt: serverTimestamp()
      });

      // Mettre à jour SendGrid
      if (subscriber.sendgridContactId) {
        await this.removeFromSendGrid(subscriber.sendgridContactId);
      }

      console.log('✅ Désabonnement effectué:', email);
      return true;

    } catch (error) {
      console.error('❌ Erreur lors du désabonnement:', error);
      return false;
    }
  }

  // ============= GESTION DES TEMPLATES =============

  /**
   * Créer un template d'email
   */
  async createTemplate(template: Omit<NewsletterTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'newsletter_templates'), {
        ...template,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Synchroniser avec SendGrid si nécessaire
      if (template.htmlContent && template.textContent) {
        const sendgridTemplateId = await this.createSendGridTemplate(template);
        if (sendgridTemplateId) {
          await updateDoc(docRef, {
            sendgridTemplateId,
            updatedAt: serverTimestamp()
          });
        }
      }

      console.log('✅ Template créé:', docRef.id);
      return docRef.id;

    } catch (error) {
      console.error('❌ Erreur lors de la création du template:', error);
      throw error;
    }
  }

  /**
   * Templates pré-configurés
   */
  getDefaultTemplates(): Partial<NewsletterTemplate>[] {
    return [
      {
        name: 'Bienvenue G-Maxing',
        type: 'welcome',
        language: 'fr',
        subject: '🚀 Bienvenue dans la méthode G-Maxing d\'Engel Garcia Gomez !',
        htmlContent: this.getWelcomeTemplateHTML(),
        textContent: this.getWelcomeTemplateText(),
        tags: ['welcome', 'engel-garcia-gomez', 'g-maxing'],
        isActive: true
      },
      {
        name: 'Newsletter Hebdomadaire G-Maxing',
        type: 'weekly',
        language: 'fr',
        subject: '💪 Votre dose hebdomadaire de G-Maxing avec Engel Garcia Gomez',
        htmlContent: this.getWeeklyTemplateHTML(),
        textContent: this.getWeeklyTemplateText(),
        tags: ['weekly', 'engel-garcia-gomez', 'tips'],
        isActive: true
      },
      {
        name: 'Transformation Spéciale',
        type: 'gmax-special',
        language: 'fr',
        subject: '🔥 Nouvelle transformation G-Maxing révélée !',
        htmlContent: this.getTransformationTemplateHTML(),
        textContent: this.getTransformationTemplateText(),
        tags: ['transformation', 'special', 'g-maxing'],
        isActive: true
      }
    ];
  }

  // ============= GESTION DES CAMPAGNES =============

  /**
   * Créer une campagne
   */
  async createCampaign(campaign: Omit<NewsletterCampaign, 'id' | 'createdAt' | 'updatedAt' | 'stats'>): Promise<string> {
    try {
      const campaignData: Omit<NewsletterCampaign, 'id'> = {
        ...campaign,
        stats: {
          sent: 0,
          delivered: 0,
          opened: 0,
          clicked: 0,
          bounced: 0,
          unsubscribed: 0
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const docRef = await addDoc(collection(db, 'newsletter_campaigns'), {
        ...campaignData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      console.log('✅ Campagne créée:', docRef.id);
      return docRef.id;

    } catch (error) {
      console.error('❌ Erreur lors de la création de campagne:', error);
      throw error;
    }
  }

  /**
   * Envoyer une campagne
   */
  async sendCampaign(campaignId: string): Promise<boolean> {
    try {
      const campaign = await this.getCampaignById(campaignId);
      if (!campaign || campaign.status !== 'draft') {
        return false;
      }

      // Obtenir les destinataires
      const recipients = await this.getTargetAudience(campaign.targetAudience);
      console.log(`📧 Envoi à ${recipients.length} destinataires`);

      // Marquer comme en cours d'envoi
      await updateDoc(doc(db, 'newsletter_campaigns', campaignId), {
        status: 'sending',
        updatedAt: serverTimestamp()
      });

      // Envoyer les emails (simulation)
      let sentCount = 0;
      for (const recipient of recipients) {
        try {
          await this.sendEmailToRecipient(recipient, campaign);
          sentCount++;
          
          // Simulation de délai pour éviter les limites
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
          console.error('Erreur envoi email:', recipient.email, error);
        }
      }

      // Marquer comme envoyé
      await updateDoc(doc(db, 'newsletter_campaigns', campaignId), {
        status: 'sent',
        sentAt: serverTimestamp(),
        'stats.sent': sentCount,
        'stats.delivered': sentCount, // Simulation
        updatedAt: serverTimestamp()
      });

      console.log('✅ Campagne envoyée:', campaignId, sentCount, 'emails');
      return true;

    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi de campagne:', error);
      
      // Marquer comme échoué
      await updateDoc(doc(db, 'newsletter_campaigns', campaignId), {
        status: 'failed',
        updatedAt: serverTimestamp()
      });
      
      return false;
    }
  }

  // ============= AUTOMATISATIONS =============

  /**
   * Créer une automation
   */
  async createAutomation(automation: Omit<NewsletterAutomation, 'id' | 'createdAt' | 'executionCount'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'newsletter_automations'), {
        ...automation,
        executionCount: 0,
        createdAt: serverTimestamp()
      });

      console.log('✅ Automation créée:', docRef.id);
      return docRef.id;

    } catch (error) {
      console.error('❌ Erreur lors de la création d\'automation:', error);
      throw error;
    }
  }

  /**
   * Déclencher une automation
   */
  async triggerAutomation(trigger: string, context: Record<string, any>): Promise<void> {
    try {
      const automations = await this.getActiveAutomations(trigger);
      
      for (const automation of automations) {
        if (this.evaluateConditions(automation.conditions, context)) {
          await this.executeAutomationActions(automation, context);
        }
      }
    } catch (error) {
      console.error('❌ Erreur lors du déclenchement d\'automation:', error);
    }
  }

  // ============= MÉTHODES PRIVÉES ET UTILITAIRES =============

  private generateInitialTags(source?: string, preferences?: any): string[] {
    const tags = ['engel-garcia-gomez', 'g-maxing'];
    
    if (source) tags.push(`source:${source}`);
    if (preferences?.gMaxing) tags.push('gmax-enthusiast');
    if (preferences?.transformation) tags.push('transformation-interested');
    
    return tags;
  }

  private generateConfirmationToken(subscriberId: string): string {
    // En production, utiliser JWT ou crypto sécurisé
    return Buffer.from(`${subscriberId}:${Date.now()}`).toString('base64');
  }

  private async getSubscriberByEmail(email: string): Promise<NewsletterSubscriber | null> {
    try {
      const existingData = localStorage.getItem('newsletter_subscribers') || '[]';
      const subscribers = JSON.parse(existingData);
      const subscriber = subscribers.find((s: any) => s.email === email.toLowerCase().trim());
      return subscriber || null;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'abonné:', error);
      return null;
    }
  }

  private async getSubscriberById(id: string): Promise<NewsletterSubscriber | null> {
    try {
      const existingData = localStorage.getItem('newsletter_subscribers') || '[]';
      const subscribers = JSON.parse(existingData);
      const subscriber = subscribers.find((s: any) => s.id === id);
      return subscriber || null;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'abonné par ID:', error);
      return null;
    }
  }

  private async reactivateSubscriber(subscriberId: string): Promise<void> {
    const existingData = localStorage.getItem('newsletter_subscribers') || '[]';
    const subscribers = JSON.parse(existingData);
    const subscriberIndex = subscribers.findIndex((s: any) => s.id === subscriberId);
    if (subscriberIndex !== -1) {
      subscribers[subscriberIndex].status = 'confirmed';
      subscribers[subscriberIndex].reactivatedAt = new Date();
      subscribers[subscriberIndex].updatedAt = new Date();
      localStorage.setItem('newsletter_subscribers', JSON.stringify(subscribers));
    }
  }

  // SendGrid Mock Methods (à remplacer par les vraies API SendGrid)
  private async addToSendGrid(subscriber: Omit<NewsletterSubscriber, 'id'>): Promise<string | null> {
    // Simulation d'ajout SendGrid
    console.log('📤 Ajout SendGrid simulé:', subscriber.email);
    return `sg_contact_${Date.now()}`;
  }

  private async updateSendGridContact(contactId: string, data: any): Promise<void> {
    console.log('🔄 Mise à jour SendGrid simulée:', contactId, data);
  }

  private async removeFromSendGrid(contactId: string): Promise<void> {
    console.log('🗑️ Suppression SendGrid simulée:', contactId);
  }

  private async createSendGridTemplate(template: any): Promise<string | null> {
    console.log('📄 Création template SendGrid simulé:', template.name);
    return `sg_template_${Date.now()}`;
  }

  private async sendConfirmationEmail(subscriberId: string): Promise<void> {
    console.log('📧 Email de confirmation simulé:', subscriberId);
  }

  private async getCampaignById(campaignId: string): Promise<NewsletterCampaign | null> {
    // Implementation simplifiée
    return null;
  }

  private async getTargetAudience(targetAudience: any): Promise<NewsletterSubscriber[]> {
    // Implementation simplifiée
    return [];
  }

  private async sendEmailToRecipient(recipient: NewsletterSubscriber, campaign: NewsletterCampaign): Promise<void> {
    console.log('📧 Email simulé envoyé à:', recipient.email);
  }

  private async getActiveAutomations(trigger: string): Promise<NewsletterAutomation[]> {
    // Implementation simplifiée
    return [];
  }

  private evaluateConditions(conditions: Record<string, any>, context: Record<string, any>): boolean {
    // Logic simplifiée
    return true;
  }

  private async executeAutomationActions(automation: NewsletterAutomation, context: Record<string, any>): Promise<void> {
    console.log('🤖 Exécution automation:', automation.name);
  }

  // Templates HTML/Text
  private getWelcomeTemplateHTML(): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 10px;">
        <div style="padding: 40px 20px; text-align: center;">
          <h1 style="font-size: 32px; margin-bottom: 20px;">🚀 Bienvenue dans le G-Maxing !</h1>
          <p style="font-size: 18px; margin-bottom: 30px;">
            Félicitations ! Vous venez de rejoindre la communauté exclusive d'<strong>Engel Garcia Gomez</strong> 
            et découvrirez tous les secrets de la méthode G-Maxing.
          </p>
          <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2>Ce que vous allez recevoir :</h2>
            <ul style="text-align: left; list-style: none; padding: 0;">
              <li style="padding: 5px 0;">✅ Conseils exclusifs de transformation</li>
              <li style="padding: 5px 0;">💪 Protocoles d'entraînement G-Maxing</li>
              <li style="padding: 5px 0;">🥗 Plans nutritionnels optimisés</li>
              <li style="padding: 5px 0;">📈 Strategies de développement personnel</li>
            </ul>
          </div>
          <a href="https://engelgmax.com/blog" 
             style="display: inline-block; background: #FFD700; color: #333; padding: 15px 30px; 
                    text-decoration: none; border-radius: 25px; font-weight: bold; margin: 20px 0;">
            Découvrir le Blog G-Maxing
          </a>
        </div>
      </div>
    `;
  }

  private getWelcomeTemplateText(): string {
    return `
    🚀 BIENVENUE DANS LE G-MAXING !

    Félicitations ! Vous venez de rejoindre la communauté exclusive d'Engel Garcia Gomez.

    Ce que vous allez recevoir :
    ✅ Conseils exclusifs de transformation
    💪 Protocoles d'entraînement G-Maxing  
    🥗 Plans nutritionnels optimisés
    📈 Strategies de développement personnel

    Découvrez le blog : https://engelgmax.com/blog

    À très bientôt,
    Engel Garcia Gomez
    `;
  }

  private getWeeklyTemplateHTML(): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>💪 Votre dose hebdomadaire de G-Maxing</h1>
        <p>Salut {{firstName}},</p>
        <p>Voici vos contenus G-Maxing de la semaine...</p>
      </div>
    `;
  }

  private getWeeklyTemplateText(): string {
    return `💪 VOTRE DOSE HEBDOMADAIRE DE G-MAXING\n\nSalut {{firstName}},\n\nVoici vos contenus de la semaine...`;
  }

  private getTransformationTemplateHTML(): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>🔥 Nouvelle transformation G-Maxing révélée !</h1>
        <p>Une transformation incroyable vous attend...</p>
      </div>
    `;
  }

  private getTransformationTemplateText(): string {
    return `🔥 NOUVELLE TRANSFORMATION G-MAXING RÉVÉLÉE !\n\nUne transformation incroyable vous attend...`;
  }

  // ============= MÉTHODES PUBLIQUES SUPPLÉMENTAIRES =============

  /**
   * Obtenir les statistiques globales
   */
  async getGlobalStats(): Promise<{
    totalSubscribers: number;
    confirmedSubscribers: number;
    pendingSubscribers: number;
    unsubscribedCount: number;
    emailsSentThisMonth: number;
    averageOpenRate: number;
  }> {
    // Implementation simplifiée
    return {
      totalSubscribers: 1245,
      confirmedSubscribers: 987,
      pendingSubscribers: 158,
      unsubscribedCount: 100,
      emailsSentThisMonth: 3456,
      averageOpenRate: 0.28
    };
  }

  /**
   * Initialiser les templates par défaut
   */
  async initializeDefaultTemplates(): Promise<void> {
    console.log('📄 Initialisation des templates par défaut...');
    
    const defaultTemplates = this.getDefaultTemplates();
    
    for (const template of defaultTemplates) {
      try {
        await this.createTemplate(template as any);
      } catch (error) {
        console.error('Erreur création template:', template.name, error);
      }
    }
    
    console.log('✅ Templates par défaut initialisés');
  }
}

// Instance singleton
export const newsletterEngine = new NewsletterEngine();

export default NewsletterEngine;
# 🚀 CHECKLIST DE DÉPLOIEMENT ENGEL G-MAX

## 📋 TODO LIST CONFIGURATION & DÉPLOIEMENT

### 1. 🔥 CONFIGURATION FIREBASE

#### Firebase Project Setup
- [ x] Créer un projet Firebase sur https://console.firebase.google.com/
- [ x] Nommer le projet : `engel-gmax-production`
- [ x] Activer Google Analytics (recommandé)
- [ ] Noter les identifiants du projet

#### Authentication
- [x] Activer Authentication dans Firebase Console
- [x] Activer les fournisseurs :
  - [x] Email/Password
  - [ ] Google (optionnel)
  - [ ] Facebook (optionnel)
- [x] Configurer les domaines autorisés dans Authentication > Settings

#### Firestore Database
- [x] Créer une base de données Firestore
- [x] Choisir le mode "production"
- [x] Sélectionner la région (europe-west1 pour la France)
- [x] ~~Copier les règles de sécurité depuis~~ `/firestore.rules` (fait)
- [x] Créer les collections de base :
  ```
  - users/
  - blog_posts/
  - newsletter_subscribers/
  - products/
  - orders/
  - analytics_events/
  ```

#### Storage (Cloudinary) ✅ MIGRÉ
- [x] ~~Installer le SDK~~ : `npm install cloudinary` (fait)
- [x] ~~Configuration technique~~ : Services et types créés (fait)
- [x] Créer un compte sur https://cloudinary.com/
- [x] Récupérer les clés API (Cloud Name, API Key, API Secret)
- [x] Créer un "Upload Preset" :
  - Nom : `unsigned_preset`
  - Mode : Unsigned
  - Resource Type : Auto
  - Access Mode : Public
- [ ] Ajouter à `.env.production` :
```env
VITE_CLOUDINARY_CLOUD_NAME=ton_cloud_name
VITE_CLOUDINARY_API_KEY=ton_api_key
CLOUDINARY_API_SECRET=ton_api_secret
```
- [ ] Tester l'upload et l'optimisation d'images
- [ ] Migrer les composants utilisant l'ancien StorageService
- [ ] Organiser les assets avec tags/folders :
  ```
  - products/ (images produits)
  - blog/ (articles et médias)
  - users/{userId}/profile/ (avatars)
  - users/{userId}/progress/ (photos avant/après)
  - site-assets/ (logos, icônes)
  - testimonials/ (photos témoignages)
  ```

#### Hosting (si hébergement Firebase)
- [x] Activer Firebase Hosting
- [x] Installer Firebase CLI : `npm install -g firebase-tools`
- [x] Se connecter : `firebase login`
- [x] Initialiser : `firebase init hosting`

#### Configuration des clés
- [x] Aller dans Project Settings > General
- [x] Copier la configuration Firebase
- [x] Créer le fichier `.env.production` :
```env
VITE_FIREBASE_API_KEY=ton_api_key
VITE_FIREBASE_AUTH_DOMAIN=ton_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=ton_project_id
VITE_FIREBASE_STORAGE_BUCKET=ton_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=ton_sender_id
VITE_FIREBASE_APP_ID=ton_app_id
VITE_FIREBASE_MEASUREMENT_ID=ton_measurement_id
```

---

### 2. 📧 CONFIGURATION SENDGRID

#### Compte SendGrid
- [ ] Créer un compte sur https://sendgrid.com/
- [ ] Vérifier ton domaine ou utiliser sendgrid.net
- [ ] Créer une API Key dans Settings > API Keys
- [ ] Ajouter à `.env.production` :
```env
VITE_SENDGRID_API_KEY=ton_sendgrid_api_key
```

#### Templates Email
- [ ] Créer les templates dans SendGrid Dashboard
- [ ] Template "Bienvenue G-Maxing" 
- [ ] Template "Newsletter Hebdomadaire"
- [ ] Template "Transformation Spéciale"
- [ ] Noter les IDs des templates

#### Domain Authentication (Recommandé)
- [ ] Configurer l'authentification de domaine
- [ ] Ajouter les enregistrements DNS fournis
- [ ] Vérifier l'authentification

---

### 3. 💳 CONFIGURATION STRIPE

#### Compte Stripe
- [x] Créer un compte sur https://stripe.com/
- [x] Activer le compte (fournir les informations légales)
- [x] Récupérer les clés dans Dashboard > Developers > API Keys
- [x] Passer en mode "Live" une fois les tests terminés

#### Configuration des clés
- [x] Ajouter à `.env.production` :
```env
VITE_STRIPE_PUBLIC_KEY=pk_live_51S5TaLD7YxdUINg8sauPBM5yPrvbARoORGnIjBOIHcMxIIrh7NXkAhjD0MiEHdkmZT8XWR2B2C8fdLV0bb4FtQj500FHEgjFDi
STRIPE_SECRET_KEY=sk_live_... (à récupérer depuis le dashboard)
VITE_STRIPE_WEBHOOK_SECRET=whsec_... (clé de signature webhook)
```

#### Produits et Prix dans Stripe Dashboard
- [ ] Créer les produits suivants :

**1. Looxmax - 29€**
- [x] Aller dans Products > Add product
- [x] Nom : "Looxmax - Protocole Apparence Faciale"
- [x] Description : "Protocole personnalisé avec vitamines, diète, entraînement facial et produits pour améliorer l'apparence faciale"
- [x] Prix : 29.00 EUR (one-time payment)
- [x] Statement descriptor : "LOOXMAX"
- [ ] Noter le Price ID : `price_1S5VfED7YxdUINg8ISFDqZQA`

**2. Natty Plus - 29€**
- [x] Créer le produit "Natty Plus - Protocole Débutant"
- [x] Description : "Protocole 8 semaines avec SARMs légers, plan diète + entraînement pour débutants motivés"
- [x] Prix : 29.00 EUR (one-time payment)
- [x] Statement descriptor : "NATTY PLUS"
- [x] Noter le Price ID : `price_1S5Vj2D7YxdUINg8YdY18UDD`

**3. Looxmaxing Avancé - 59€**
- [x] Créer le produit "Looxmaxing Avancé - Peptides"
- [x] Description : "Protocole avancé 6-12 semaines avec peptides (GHK-Cu, TB-500) pour esthétique faciale et corporelle"
- [x] Prix : 59.00 EUR (one-time payment)
- [x] Statement descriptor : "LOOXMAX ADV"
- [x] Noter le Price ID : `price_1S5VlVD7YxdUINg8QXLshodp`

**4. Productivité - 29€**
- [x] Créer le produit "Protocole Productivité"
- [x] Description : "Nootropiques naturels, suppléments mémoire/énergie, techniques biohacking cognitif"
- [x] Prix : 29.00 EUR (one-time payment)
- [x] Statement descriptor : "PRODUCTIVITE"
- [x] Noter le Price ID : `price_1S5VncD7YxdUINg8uAO6a1M8`

**5. Accompagnement Personnalisé - 99€**
- [x] Créer le produit "Accompagnement 100% Personnalisé"
- [x] Description : "Protocole sur mesure, 2 appels vidéo 20min, suivi mail/DM pendant 6-12 semaines"
- [x] Prix : 99.00 EUR (one-time payment)
- [x] Statement descriptor : "ACCOMPAGNEMENT"
- [x] Noter le Price ID : `price_1S5VowD7YxdUINg808jNSKJ5`

#### Promotion Automatique
- [ ] Configurer une réduction de 25% automatique quand 2 protocoles ou + sont achetés
- [ ] Implémenter la logique côté frontend/backend (pas un produit Stripe séparé)

#### Configuration Avancée des Produits
- [ ] Ajouter des images pour chaque produit
- [ ] Configurer les métadonnées (product_type, category, etc.)
- [ ] Activer la facturation automatique si nécessaire
- [ ] Configurer les descriptions de relevé bancaire

#### Webhooks Configuration
- [ ] Aller dans Developers > Webhooks
- [ ] Cliquer "Add endpoint"
- [ ] URL : `https://tonsite.com/api/stripe/webhook`
- [ ] Sélectionner les événements suivants :
  - [ ] `checkout.session.completed` (paiement terminé)
  - [ ] `payment_intent.succeeded` (paiement réussi)
  - [ ] `payment_intent.payment_failed` (paiement échoué)
  - [ ] `invoice.payment_succeeded` (pour les abonnements)
  - [ ] `customer.subscription.created` (nouvel abonnement)
  - [ ] `customer.subscription.updated` (modification abonnement)
  - [ ] `customer.subscription.deleted` (annulation abonnement)
- [ ] Récupérer la clé de signature webhook (whsec_...)
- [ ] Tester le webhook avec l'outil Stripe CLI

#### Checkout Sessions (Pages de Paiement)
- [ ] Configurer les success_url et cancel_url :
  - Success : `https://tonsite.com/payment/success?session_id={CHECKOUT_SESSION_ID}`
  - Cancel : `https://tonsite.com/payment/cancel`
- [ ] Activer la collecte d'adresse de facturation
- [ ] Configurer les modes de paiement acceptés (card, google_pay, apple_pay)
- [ ] Personnaliser l'apparence avec votre branding

#### Configuration Fiscale
- [ ] Configurer la TVA si applicable dans Settings > Tax
- [ ] Ajouter votre numéro de TVA français
- [ ] Configurer les taux de TVA par pays
- [ ] Activer la facturation automatique

#### Tests et Sécurité
- [ ] Utiliser les clés de test pour les développements
- [ ] Tester tous les scénarios de paiement :
  - [ ] Paiement réussi avec carte test : 4242 4242 4242 4242
  - [ ] Paiement échoué avec carte test : 4000 0000 0000 0002
  - [ ] 3D Secure avec carte test : 4000 0025 0000 3155
- [ ] Vérifier la gestion des erreurs
- [ ] Tester les webhooks en local avec Stripe CLI
- [ ] Valider les montants et devises
- [ ] Tester sur mobile (Apple Pay, Google Pay)

#### Surveillance et Reporting
- [ ] Configurer les alertes email pour :
  - [ ] Paiements échoués
  - [ ] Chargebacks/contestations
  - [ ] Revenus quotidiens/hebdomadaires
- [ ] Activer Radar pour la prévention de fraude
- [ ] Configurer les rapports automatiques
- [ ] Monitorer les métriques dans le dashboard

#### Conformité et Légal
- [ ] Ajouter les mentions légales de remboursement
- [ ] Configurer la politique de remboursement dans Stripe
- [ ] Vérifier la conformité PCI DSS (automatique avec Stripe)
- [ ] Ajouter les CGV sur les pages de paiement

---

### 4. 🌐 CONFIGURATION DOMAINE

#### Nom de Domaine
- [ ] Acheter le domaine `engelgmax.com` (ou similaire)
- [ ] Configurer les DNS vers ton hébergeur

#### SSL/TLS
- [ ] Activer le certificat SSL
- [ ] Forcer HTTPS
- [ ] Tester avec https://www.ssllabs.com/

#### CDN (Optionnel)
- [ ] Configurer Cloudflare pour les performances
- [ ] Activer la compression Gzip/Brotli
- [ ] Configurer le cache

---

### 5. 📊 CONFIGURATION ANALYTICS

#### Google Analytics 4
- [ ] Créer une propriété GA4
- [ ] Récupérer le Measurement ID
- [ ] Ajouter à `.env.production` :
```env
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

#### Google Search Console
- [ ] Ajouter la propriété dans Search Console
- [ ] Vérifier la propriété
- [ ] Soumettre le sitemap.xml

#### Meta Pixel (Facebook)
- [ ] Créer un pixel Facebook si besoin
- [ ] Ajouter le code de suivi

---

### 6. 🔍 CONFIGURATION SEO

#### Google My Business
- [ ] Créer une fiche Google My Business pour "Engel Garcia Gomez"
- [ ] Optimiser avec photos, description, services
- [ ] Demander des avis clients

#### Sitemap.xml
- [ ] Générer et héberger le sitemap
- [ ] Soumettre à Google Search Console
- [ ] Soumettre à Bing Webmaster Tools

#### Robots.txt
- [ ] Créer le fichier robots.txt :
```
User-agent: *
Allow: /
Sitemap: https://engelgmax.com/sitemap.xml
```

---

### 7. 📱 CONFIGURATION PWA

#### Icônes PWA
- [ ] Créer toutes les tailles d'icônes :
  - [ ] 72x72, 96x96, 128x128, 144x144
  - [ ] 152x152, 192x192, 384x384, 512x512
- [ ] Les placer dans `/public/icons/`

#### Screenshots
- [ ] Capturer des screenshots pour le manifest :
  - [ ] Desktop (1280x720)
  - [ ] Mobile (390x844)
- [ ] Les placer dans `/public/screenshots/`

#### Test PWA
- [ ] Tester avec Lighthouse
- [ ] Vérifier l'installation sur mobile
- [ ] Tester le mode hors ligne

---

### 8. 🎨 CONTENU ET MÉDIAS

#### Images
- [ ] Créer et optimiser les images :
  - [ ] Photo professionnelle d'Engel Garcia Gomez
  - [ ] Images de transformations (avant/après)
  - [ ] Images de produits
  - [ ] Logo Engel G-Max
- [ ] Optimiser toutes les images (WebP, compression)

#### Contenu
- [ ] Réviser tous les textes
- [ ] Ajouter de vrais témoignages clients
- [ ] Créer du contenu blog supplémentaire
- [ ] Traduire en anglais et espagnol

---

### 9. 🔐 SÉCURITÉ

#### Variables d'Environnement
- [ ] Vérifier que toutes les clés sensibles sont dans `.env`
- [ ] Variables Cloudinary configurées (API_SECRET côté serveur uniquement)
- [x] ~~Template `.env.example` mis à jour~~ (fait)
- [ ] Ne jamais commiter les fichiers `.env`
- [ ] Utiliser des variables d'environnement sur le serveur

#### Règles de Sécurité
- [ ] Vérifier les règles Firestore
- [ ] Configurer les restrictions Cloudinary Upload Preset (formats, taille)
- [ ] Limiter les accès API
- [ ] Configurer CORS correctement

#### Backup
- [ ] Configurer les sauvegardes Firestore
- [ ] Politique de sauvegarde Cloudinary (plan payant)
- [ ] Sauvegarder le code source
- [ ] Documenter la procédure de restauration

---

### 10. 🚀 DÉPLOIEMENT

#### Build Production
- [ ] Installer les dépendances : `npm install`
- [ ] Créer le build : `npm run build`
- [ ] Tester le build localement : `npm run preview`

#### Tests Pre-Déploiement
- [ ] Tester toutes les fonctionnalités
- [ ] Vérifier les formulaires (newsletter, contact)
- [ ] Tester les paiements Stripe
- [ ] Vérifier le responsive mobile

#### Déploiement
- [ ] Déployer sur l'hébergeur choisi
- [ ] Configurer les variables d'environnement
- [ ] Tester en production

#### Post-Déploiement
- [ ] Vérifier tous les liens
- [ ] Tester la vitesse (PageSpeed Insights)
- [ ] Vérifier le SEO (Search Console)
- [ ] Monitorer les erreurs

---

### 11. 📈 MARKETING & LANCEMENT

#### Réseaux Sociaux
- [ ] Créer/optimiser les comptes :
  - [ ] Instagram @engelgarciagomez_gmax
  - [ ] YouTube @EngelGarciaGomezGMax
  - [ ] Twitter/X @EngelGMax
  - [ ] Facebook EngelGarciaGomezOfficial
  - [ ] LinkedIn engel-garcia-gomez-gmax
  - [ ] TikTok @engelgmax

#### Contenu de Lancement
- [ ] Préparer les posts de lancement
- [ ] Créer des stories Instagram
- [ ] Préparer une vidéo de présentation
- [ ] Lancer une campagne newsletter

---

### 12. 📊 MONITORING

#### Outils de Monitoring
- [ ] Configurer des alertes d'erreurs
- [ ] Monitorer les performances
- [ ] Surveiller le traffic Analytics
- [ ] Tracker les conversions

#### KPIs à Suivre
- [ ] Visiteurs uniques
- [ ] Taux de conversion newsletter
- [ ] Ventes e-commerce
- [ ] Temps sur le site
- [ ] Taux de rebond

---

## ✅ VALIDATION FINALE

- [ ] ✅ Tous les services externes configurés
- [ ] ✅ Migration Cloudinary terminée et testée
- [ ] ✅ Site accessible et fonctionnel
- [ ] ✅ Images optimisées avec Cloudinary
- [ ] ✅ SEO optimisé et indexé
- [ ] ✅ PWA installable
- [ ] ✅ Paiements fonctionnels
- [ ] ✅ Newsletter opérationnelle
- [ ] ✅ Analytics tracking
- [ ] ✅ Monitoring en place

---

## 🆘 CONTACTS SUPPORT

- **Firebase Support** : https://support.google.com/firebase/
- **Cloudinary Support** : https://support.cloudinary.com/
- **SendGrid Support** : https://support.sendgrid.com/
- **Stripe Support** : https://support.stripe.com/
- **Google Analytics Help** : https://support.google.com/analytics/

---

## 📞 BESOIN D'AIDE ?

Si tu rencontres des difficultés avec une étape, note-la et on pourra la résoudre ensemble ! 

**BONNE CHANCE POUR TON LANCEMENT ! 🚀💪**
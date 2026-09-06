/* src/i18n/dictionaries.ts */

import { Categories } from '@/app/constants';

export const LANGUAGES = ['en', 'fr'] as const;

export type Language = (typeof LANGUAGES)[number];

export const LANGUAGE_LABELS: Record<Language, string> = {
  en: 'English',
  fr: 'Français',
};

/**
 * The English dictionary is the reference: every other language must declare
 * the same keys, which `Dictionary` enforces at compile time.
 */
const en = {
  'language.label': 'Language',

  'header.github': 'GitHub',
  'header.twitter': 'Twitter',
  'header.linkedin': 'LinkedIn',
  'header.docs': 'Documentation',
  'header.darkMode': 'Dark Mode',
  'header.lightMode': 'Light Mode',
  'header.menu': 'Menu',
  'header.provider': 'Cloud provider',

  'table.title': 'The {provider} Periodic Table',
  'table.subtitle':
    'Bringing together core {provider} content to supercharge your productivity.',
  'table.subtitleMobile': 'Supercharge your productivity in {provider}.',

  'topbar.share': 'Share',
  'topbar.download': 'Download',
  'topbar.downloading': 'Exporting...',
  'topbar.filter': 'Filter by category',
  'topbar.fullScreen': 'Full screen',
  'topbar.exitFullScreen': 'Exit full screen',
  'topbar.searchPlaceholder': 'Search {provider} resources...',

  'share.title': 'Copy the link or share to Twitter or LinkedIn below',
  'share.link': 'Link',
  'share.copy': 'Copy the link',
  'share.copied': 'Copied',

  'sidebar.general': 'General',
  'sidebar.generalDescription': 'General information about the service.',
  'sidebar.description': 'Description',
  'sidebar.namespaceEntity': 'Namespace and Entity',
  'sidebar.category': 'Category',
  'sidebar.references': 'References',
  'sidebar.chat': 'Chat',
  'sidebar.chatDescription': 'Talk to this service to learn more about it.',
  'sidebar.poweredByAi': 'Powered by AI',
  'sidebar.naming': 'Naming',
  'sidebar.namingDescription':
    'The conventions, rules, and restrictions for naming this service.',
  'sidebar.namingConvention': 'Naming Convention',
  'sidebar.length': 'Length',
  'sidebar.validCharacters': 'Valid Characters',
  'sidebar.scope': 'Scope',
  'sidebar.code': 'Code',
  'sidebar.codeDescription':
    'Deploy your infrastructure as code using your preferred tooling.',
  'sidebar.officialDocumentation': 'Official Documentation',
  'sidebar.utilities': 'Utilities',
  'sidebar.utilitiesDescription':
    'Utilities to support app deployment or configuration.',
  'sidebar.privateEndpoints': 'Private Endpoints',
  'sidebar.privateEndpointsDescription':
    'Details to successfully deploy private endpoints on Azure.',
  'sidebar.subResourceNames': 'Sub-Resource Names',
  'sidebar.privateDnsZoneNames': 'Private DNS Zone Names',
  'sidebar.publicDnsForwarders': 'Public DNS Zone Forwarders',
  'sidebar.commercial': 'Commercial',
  'sidebar.government': 'Government',
  'sidebar.china': 'China',

  'admin.title': 'Data Health Dashboard',
  'admin.subtitle':
    'Consistency checks run against every cloud provider dataset.',
  'admin.password': 'Password',
  'admin.passwordPlaceholder': 'Administrator password',
  'admin.signIn': 'Unlock',
  'admin.signOut': 'Lock again',
  'admin.checking': 'Running checks...',
  'admin.wrongPassword': 'Wrong password.',
  'admin.notConfigured':
    'ADMIN_PASSWORD is not set on the server: the admin interface is disabled.',
  'admin.refresh': 'Re-run the checks',
  'admin.summary': 'Summary',
  'admin.errors': 'Errors',
  'admin.warnings': 'Warnings',
  'admin.infos': 'Notices',
  'admin.resources': 'Resources',
  'admin.noIssue': 'No issue found. Every dataset passes the checks.',
  'admin.provider': 'Provider',
  'admin.rule': 'Rule',
  'admin.message': 'Message',
  'admin.resource': 'Resource',
  'admin.allProviders': 'All providers',
  'admin.severity': 'Severity',
  'admin.backToTable': 'Back to the table',

  [`category.${Categories.GENERAL}`]: 'General',
  [`category.${Categories.NETWORKING}`]: 'Networking',
  [`category.${Categories.COMPUTEANDWEB}`]: 'Compute & Web',
  [`category.${Categories.CONTAINERS}`]: 'Containers',
  [`category.${Categories.DATABASES}`]: 'Databases',
  [`category.${Categories.STORAGE}`]: 'Storage',
  [`category.${Categories.AIANDML}`]: 'AI & ML',
  [`category.${Categories.ANALYTICSANDIOT}`]: 'Analytics & IoT',
  [`category.${Categories.VIRTUALDESKTOP}`]: 'Virtual Desktop',
  [`category.${Categories.DEVTOOLS}`]: 'Dev Tools',
  [`category.${Categories.INTEGRATION}`]: 'Integration',
  [`category.${Categories.MIGRATION}`]: 'Migration',
  [`category.${Categories.MANAGEMENT}`]: 'Management',
};

// `Extract<..., string>` keeps the union to string literals: the computed
// `category.${Categories.X}` keys would otherwise widen the union to string | number.
export type TranslationKey = Extract<keyof typeof en, string>;

export type Dictionary = Record<TranslationKey, string>;

const fr: Dictionary = {
  'language.label': 'Langue',

  'header.github': 'GitHub',
  'header.twitter': 'Twitter',
  'header.linkedin': 'LinkedIn',
  'header.docs': 'Documentation',
  'header.darkMode': 'Mode sombre',
  'header.lightMode': 'Mode clair',
  'header.menu': 'Menu',
  'header.provider': 'Fournisseur cloud',

  'table.title': 'Le tableau périodique {provider}',
  'table.subtitle':
    'Toutes les ressources {provider} essentielles réunies pour booster votre productivité.',
  'table.subtitleMobile': 'Boostez votre productivité sur {provider}.',

  'topbar.share': 'Partager',
  'topbar.download': 'Télécharger',
  'topbar.downloading': 'Export en cours...',
  'topbar.filter': 'Filtrer par catégorie',
  'topbar.fullScreen': 'Plein écran',
  'topbar.exitFullScreen': 'Quitter le plein écran',
  'topbar.searchPlaceholder': 'Rechercher une ressource {provider}...',

  'share.title': 'Copiez le lien ou partagez sur Twitter ou LinkedIn',
  'share.link': 'Lien',
  'share.copy': 'Copier le lien',
  'share.copied': 'Copié',

  'sidebar.general': 'Général',
  'sidebar.generalDescription': 'Informations générales sur le service.',
  'sidebar.description': 'Description',
  'sidebar.namespaceEntity': 'Namespace et entité',
  'sidebar.category': 'Catégorie',
  'sidebar.references': 'Références',
  'sidebar.chat': 'Assistant',
  'sidebar.chatDescription':
    'Discutez avec ce service pour en apprendre davantage.',
  'sidebar.poweredByAi': 'Propulsé par IA',
  'sidebar.naming': 'Nommage',
  'sidebar.namingDescription':
    'Les conventions, règles et restrictions de nommage de ce service.',
  'sidebar.namingConvention': 'Convention de nommage',
  'sidebar.length': 'Longueur',
  'sidebar.validCharacters': 'Caractères autorisés',
  'sidebar.scope': 'Portée',
  'sidebar.code': 'Code',
  'sidebar.codeDescription':
    'Déployez votre infrastructure as code avec l’outil de votre choix.',
  'sidebar.officialDocumentation': 'Documentation officielle',
  'sidebar.utilities': 'Utilitaires',
  'sidebar.utilitiesDescription':
    'Utilitaires pour le déploiement ou la configuration.',
  'sidebar.privateEndpoints': 'Points de terminaison privés',
  'sidebar.privateEndpointsDescription':
    'Informations nécessaires au déploiement des points de terminaison privés sur Azure.',
  'sidebar.subResourceNames': 'Noms de sous-ressources',
  'sidebar.privateDnsZoneNames': 'Noms de zones DNS privées',
  'sidebar.publicDnsForwarders': 'Redirecteurs DNS publics',
  'sidebar.commercial': 'Commercial',
  'sidebar.government': 'Gouvernement',
  'sidebar.china': 'Chine',

  'admin.title': 'Tableau de bord des données',
  'admin.subtitle':
    'Contrôles de cohérence exécutés sur les données de chaque fournisseur cloud.',
  'admin.password': 'Mot de passe',
  'admin.passwordPlaceholder': 'Mot de passe administrateur',
  'admin.signIn': 'Déverrouiller',
  'admin.signOut': 'Verrouiller',
  'admin.checking': 'Contrôles en cours...',
  'admin.wrongPassword': 'Mot de passe incorrect.',
  'admin.notConfigured':
    "ADMIN_PASSWORD n'est pas défini sur le serveur : l'interface admin est désactivée.",
  'admin.refresh': 'Relancer les contrôles',
  'admin.summary': 'Résumé',
  'admin.errors': 'Erreurs',
  'admin.warnings': 'Avertissements',
  'admin.infos': 'Informations',
  'admin.resources': 'Ressources',
  'admin.noIssue': 'Aucun problème détecté. Toutes les données passent les contrôles.',
  'admin.provider': 'Fournisseur',
  'admin.rule': 'Règle',
  'admin.message': 'Message',
  'admin.resource': 'Ressource',
  'admin.allProviders': 'Tous les fournisseurs',
  'admin.severity': 'Sévérité',
  'admin.backToTable': 'Retour au tableau',

  [`category.${Categories.GENERAL}`]: 'Général',
  [`category.${Categories.NETWORKING}`]: 'Réseau',
  [`category.${Categories.COMPUTEANDWEB}`]: 'Calcul & Web',
  [`category.${Categories.CONTAINERS}`]: 'Conteneurs',
  [`category.${Categories.DATABASES}`]: 'Bases de données',
  [`category.${Categories.STORAGE}`]: 'Stockage',
  [`category.${Categories.AIANDML}`]: 'IA & ML',
  [`category.${Categories.ANALYTICSANDIOT}`]: 'Analytique & IoT',
  [`category.${Categories.VIRTUALDESKTOP}`]: 'Bureau virtuel',
  [`category.${Categories.DEVTOOLS}`]: 'Outils de dev',
  [`category.${Categories.INTEGRATION}`]: 'Intégration',
  [`category.${Categories.MIGRATION}`]: 'Migration',
  [`category.${Categories.MANAGEMENT}`]: 'Gestion',
};

export const dictionaries: Record<Language, Dictionary> = { en, fr };

export function isLanguage(value: unknown): value is Language {
  return typeof value === 'string' && (LANGUAGES as readonly string[]).includes(value);
}

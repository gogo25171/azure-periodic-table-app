/* src/config.ts */

/**
 * Reads a boolean from an environment variable.
 * Anything that is not explicitly 'false' / '0' / 'no' keeps the fallback value,
 * so an unset variable never hides a link that used to be visible.
 */
function envFlag(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined || value === '') return fallback;
  const normalized = value.trim().toLowerCase();
  if (['false', '0', 'no', 'off'].includes(normalized)) return false;
  if (['true', '1', 'yes', 'on'].includes(normalized)) return true;
  return fallback;
}

function envUrl(value: string | undefined, fallback: string): string {
  return value && value.trim() !== '' ? value.trim() : fallback;
}

const DEFAULT_URLS = {
  site: 'https://azureperiodictable.com/',
  github: 'https://github.com/onwardplatforms/azure-periodic-table-app',
  twitter: 'https://twitter.com/reillyjodonnell',
  linkedin: 'https://www.linkedin.com/in/justin-o-connor-67376483/',
  docs: 'https://gogo25171.github.io/azure-periodic-table-app/',
};

export const siteConfig = {
  title: envUrl(process.env.NEXT_PUBLIC_SITE_TITLE, 'Onward Platforms'),
  url: envUrl(process.env.NEXT_PUBLIC_SITE_URL, DEFAULT_URLS.site),
  github: envUrl(process.env.NEXT_PUBLIC_GITHUB_URL, DEFAULT_URLS.github),
  twitter: envUrl(process.env.NEXT_PUBLIC_TWITTER_URL, DEFAULT_URLS.twitter),
  linkedin: envUrl(process.env.NEXT_PUBLIC_LINKEDIN_URL, DEFAULT_URLS.linkedin),
  docs: envUrl(process.env.NEXT_PUBLIC_DOCS_URL, DEFAULT_URLS.docs),
};

/**
 * Branding block of the header (logo + site title).
 * - NEXT_PUBLIC_SHOW_BRAND=false removes the whole block.
 * - NEXT_PUBLIC_SHOW_BRAND_LOGO / _TITLE hide only one half of it.
 * - NEXT_PUBLIC_BRAND_LOGO_URL replaces the default icon with an image served
 *   from public/ (for example /my-logo.svg), resolved against NEXT_PUBLIC_BASE_PATH.
 * - NEXT_PUBLIC_BRAND_URL turns the block into a link.
 */
export const brandConfig = {
  enabled: envFlag(process.env.NEXT_PUBLIC_SHOW_BRAND, true),
  showLogo: envFlag(process.env.NEXT_PUBLIC_SHOW_BRAND_LOGO, true),
  showTitle: envFlag(process.env.NEXT_PUBLIC_SHOW_BRAND_TITLE, true),
  title: envUrl(process.env.NEXT_PUBLIC_SITE_TITLE, 'Onward Platforms'),
  logoUrl: envUrl(process.env.NEXT_PUBLIC_BRAND_LOGO_URL, ''),
  href: envUrl(process.env.NEXT_PUBLIC_BRAND_URL, ''),
};

/**
 * Visibility switches for the social links in the header and in the share popover.
 * Set the matching NEXT_PUBLIC_SHOW_* variable to `false` to hide an icon everywhere.
 */
export const socialLinksConfig = {
  github: {
    enabled: envFlag(process.env.NEXT_PUBLIC_SHOW_GITHUB, true),
    url: siteConfig.github,
  },
  twitter: {
    enabled: envFlag(process.env.NEXT_PUBLIC_SHOW_TWITTER, true),
    url: siteConfig.twitter,
  },
  linkedin: {
    enabled: envFlag(process.env.NEXT_PUBLIC_SHOW_LINKEDIN, true),
    url: siteConfig.linkedin,
  },
  docs: {
    enabled: envFlag(process.env.NEXT_PUBLIC_SHOW_DOCS, false),
    url: siteConfig.docs,
  },
};

/** True when every social link is hidden — used to drop empty separators. */
export const hasAnySocialLink =
  socialLinksConfig.github.enabled ||
  socialLinksConfig.twitter.enabled ||
  socialLinksConfig.linkedin.enabled ||
  socialLinksConfig.docs.enabled;

const twitterUsername = "Justin O'Connor";
const encodedWebsite = encodeURIComponent(siteConfig.url);
const encodedUsername = encodeURIComponent(twitterUsername);
const hashtag = '%23AzurePeriodicTable';

export const socialConfig = {
  twitterUsername: 'reillyjodonnell',
  linkedinUsername: 'justin-o-connor-67376483',
  tweet: `Check%20out%20the%20Azure%20Resource%20Naming%20Convention%20Periodic%20Table!%20Created%20by%20${encodedUsername}%0A${encodedWebsite}%0A${hashtag}`,
  twitter: 'https://twitter.com/intent/tweet?text=',
  linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${siteConfig.url}`,
};

export const colorConfig = {
  gray: 'bg-gray-500',
  red: 'bg-red-500',
  orange: 'bg-orange-500',
  yellow: 'bg-yellow-500',
  lime: 'bg-lime-500',
  green: 'bg-green-500',
  cyan: 'bg-cyan-500',
  blue: 'bg-blue-500',
  indigo: 'bg-indigo-500',
  violet: 'bg-violet-500',
  fuchsia: 'bg-fuchsia-500',
  pink: 'bg-pink-500',
  rose: 'bg-rose-500',
  teal: 'bg-teal-500',
  emerald: 'bg-emerald-500',
  sky: 'bg-sky-500',
  amber: 'bg-amber-500',
  stone: 'bg-stone-500',
};

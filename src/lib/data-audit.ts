/* src/lib/data-audit.ts */

import { Categories } from '@/app/constants';
import * as azureData from '@/app/data/azure';
import * as awsData from '@/app/data/aws';
import * as googleData from '@/app/data/google';
import * as ovhData from '@/app/data/ovh';
import * as scalewayData from '@/app/data/scaleway';
import type { Item } from '@/app/data/azure';

export type Severity = 'error' | 'warning' | 'info';

export type Finding = {
  severity: Severity;
  rule: string;
  provider: string;
  resourceId?: string;
  resourceName?: string;
  message: string;
};

export type ProviderStats = {
  provider: string;
  resources: number;
  columns: number;
  categories: string[];
  errors: number;
  warnings: number;
  infos: number;
};

export type AuditReport = {
  generatedAt: string;
  totals: {
    providers: number;
    resources: number;
    errors: number;
    warnings: number;
    infos: number;
  };
  providers: ProviderStats[];
  findings: Finding[];
};

/** Every dataset the audit walks through, keyed by provider id. */
export const providerDatasets: Record<string, { columns: { items: Item[] }[] }> =
  {
    azure: azureData,
    aws: awsData,
    google: googleData,
    ovh: ovhData,
    scaleway: scalewayData,
  };

/** Expected id prefix per provider (azure keeps its historical bare ids). */
const ID_PREFIXES: Record<string, string | null> = {
  azure: null,
  aws: 'aws-',
  google: 'gcp-',
  ovh: 'ovh-',
  scaleway: 'scaleway-',
};

/**
 * Words that must not show up in another provider's dataset. This is what
 * catches a resource copy-pasted from one provider file into another.
 */
const FOREIGN_KEYWORDS: Record<string, string[]> = {
  azure: ['azure', 'microsoft'],
  aws: ['aws', 'amazon'],
  google: ['google cloud', 'gcp'],
  ovh: ['ovhcloud', 'ovh'],
  scaleway: ['scaleway'],
};

/** Terraform registry namespace expected in `terraformUrl`, per provider. */
const TERRAFORM_NAMESPACES: Record<string, string[]> = {
  azure: ['/hashicorp/azurerm/'],
  aws: ['/hashicorp/aws/'],
  google: ['/hashicorp/google/', '/hashicorp/google-beta/'],
  ovh: ['/ovh/ovh/'],
  scaleway: ['/scaleway/scaleway/'],
};

/** Missing one of these breaks the table or the resource route. */
const CRITICAL_FIELDS: (keyof Item)[] = ['id', 'name', 'slug', 'category'];

/** Missing one of these only leaves a gap in the sidebar. */
const EXPECTED_FIELDS: (keyof Item)[] = [
  'description',
  'length',
  'learnUrl',
  'terraformUrl',
  'restrictions',
];

const KNOWN_CATEGORIES = new Set<string>(Object.values(Categories));

export type AuditOptions = {
  /**
   * Returns false when the icon file cannot be found on disk. Only the server
   * can answer that, so the check is skipped when the callback is absent.
   */
  iconExists?: (provider: string, iconPath: string) => boolean;
};

export function auditProviders(options: AuditOptions = {}): AuditReport {
  const findings: Finding[] = [];
  const providers: ProviderStats[] = [];
  const idOwners = new Map<string, string[]>();
  let totalResources = 0;

  for (const [provider, dataset] of Object.entries(providerDatasets)) {
    const items = dataset.columns.flatMap((column) => column.items);
    const slugs = new Map<string, string[]>();
    const categories = new Set<string>();

    totalResources += items.length;

    const push = (
      severity: Severity,
      rule: string,
      item: Item | null,
      message: string
    ) =>
      findings.push({
        severity,
        rule,
        provider,
        resourceId: item?.id,
        resourceName: item?.name,
        message,
      });

    if (items.length === 0) {
      push('error', 'empty-dataset', null, 'This provider has no resource.');
    }

    for (const item of items) {
      idOwners.set(item.id, [...(idOwners.get(item.id) ?? []), provider]);
      slugs.set(item.slug, [...(slugs.get(item.slug) ?? []), item.id]);
      categories.add(item.category);

      const isEmpty = (field: keyof Item) => {
        const value = item[field];
        return value === undefined || value === null || String(value).trim() === '';
      };

      for (const field of CRITICAL_FIELDS) {
        if (isEmpty(field)) {
          push('error', 'missing-field', item, `\`${field}\` is empty.`);
        }
      }

      for (const field of EXPECTED_FIELDS) {
        if (isEmpty(field)) {
          push('warning', 'incomplete-field', item, `\`${field}\` is empty.`);
        }
      }

      if (!KNOWN_CATEGORIES.has(item.category)) {
        push(
          'error',
          'unknown-category',
          item,
          `Category "${item.category}" is not declared in the Categories enum.`
        );
      }

      const prefix = ID_PREFIXES[provider];
      if (prefix && !item.id.startsWith(prefix)) {
        push(
          'warning',
          'id-prefix',
          item,
          `The id should start with "${prefix}" to stay unique across providers.`
        );
      }

      if (item.id !== item.id.toLowerCase() || /\s/.test(item.id)) {
        push(
          'error',
          'id-format',
          item,
          'The id must be lowercase and must not contain spaces (it is used in the URL).'
        );
      }

      if (item.slug && !item.slug.endsWith('-')) {
        push(
          'info',
          'slug-format',
          item,
          `The naming prefix "${item.slug}" usually ends with a hyphen.`
        );
      }

      if (item.length && !/^(\d+-\d+|\d+|N\/A)$/i.test(item.length.trim())) {
        push(
          'warning',
          'length-format',
          item,
          `\`length\` should look like "3-24" or "N/A" (found "${item.length}").`
        );
      }

      for (const [field, value] of Object.entries({
        learnUrl: item.learnUrl,
        terraformUrl: item.terraformUrl,
        portalUrl: item.portalUrl,
        pricingReferenceUrl: item.pricingReferenceUrl,
      })) {
        if (!value || value === 'Free') continue;
        if (!/^https:\/\//.test(value)) {
          push(
            'warning',
            'url-scheme',
            item,
            `\`${field}\` should be an https URL (found "${value}").`
          );
        }
      }

      const namespaces = TERRAFORM_NAMESPACES[provider];
      if (
        namespaces &&
        item.terraformUrl &&
        item.terraformUrl.includes('registry.terraform.io') &&
        !namespaces.some((namespace) => item.terraformUrl.includes(namespace))
      ) {
        push(
          'error',
          'terraform-namespace',
          item,
          `\`terraformUrl\` does not point to the ${provider} Terraform provider (${namespaces.join(
            ' or '
          )}).`
        );
      }

      const haystack = `${item.name} ${item.description}`.toLowerCase();
      for (const [otherProvider, keywords] of Object.entries(FOREIGN_KEYWORDS)) {
        if (otherProvider === provider) continue;
        const hit = keywords.find((keyword) => haystack.includes(keyword));
        if (hit) {
          push(
            'warning',
            'foreign-content',
            item,
            `The description mentions "${hit}": is this resource really a ${provider} one?`
          );
          break;
        }
      }

      if (!item.icon) {
        push(
          'info',
          'missing-icon',
          item,
          'No icon declared: the cell is rendered without an icon.'
        );
      } else if (options.iconExists && !options.iconExists(provider, item.icon)) {
        push(
          'warning',
          'icon-not-found',
          item,
          `Icon file "${item.icon}" was not found under public/.`
        );
      }

      if (!item.terraformCode || item.terraformCode.trim() === '') {
        push(
          'info',
          'missing-terraform-code',
          item,
          'No Terraform snippet: the resource page will show an empty code block.'
        );
      }

      if (!item.pricingReferenceUrl) {
        push('info', 'missing-pricing', item, 'No pricing reference URL.');
      }

      if (!item.portalUrl) {
        push('info', 'missing-portal', item, 'No portal/console URL.');
      }
    }

    for (const [slug, owners] of Array.from(slugs.entries())) {
      if (owners.length > 1) {
        findings.push({
          severity: 'warning',
          rule: 'duplicate-slug',
          provider,
          resourceId: owners[0],
          message: `The naming prefix "${slug}" is shared by ${owners.length} resources (${owners.join(
            ', '
          )}).`,
        });
      }
    }

    const providerFindings = findings.filter((f) => f.provider === provider);
    providers.push({
      provider,
      resources: items.length,
      columns: dataset.columns.length,
      categories: Array.from(categories).sort(),
      errors: providerFindings.filter((f) => f.severity === 'error').length,
      warnings: providerFindings.filter((f) => f.severity === 'warning').length,
      infos: providerFindings.filter((f) => f.severity === 'info').length,
    });
  }

  // Ids are resolved globally by /resource/[id], so a duplicate hides a resource.
  for (const [id, owners] of Array.from(idOwners.entries())) {
    if (owners.length > 1) {
      findings.push({
        severity: 'error',
        rule: 'duplicate-id',
        provider: owners.join(', '),
        resourceId: id,
        message: `The id "${id}" is used by several providers (${owners.join(
          ', '
        )}): only the first one is reachable at /resource/${id}.`,
      });
    }
  }

  const severityRank: Record<Severity, number> = {
    error: 0,
    warning: 1,
    info: 2,
  };
  findings.sort(
    (a, b) =>
      severityRank[a.severity] - severityRank[b.severity] ||
      a.provider.localeCompare(b.provider) ||
      a.rule.localeCompare(b.rule)
  );

  return {
    generatedAt: new Date().toISOString(),
    totals: {
      providers: providers.length,
      resources: totalResources,
      errors: findings.filter((f) => f.severity === 'error').length,
      warnings: findings.filter((f) => f.severity === 'warning').length,
      infos: findings.filter((f) => f.severity === 'info').length,
    },
    providers,
    findings,
  };
}

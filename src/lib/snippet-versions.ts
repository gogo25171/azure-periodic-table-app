/* src/lib/snippet-versions.ts
 *
 * Version facts shown under each code tab of a resource sheet. Everything here
 * is pure: it reads the data file fields and the snippet text, nothing else, so
 * the tests and the server route share it.
 */

/** Terraform provider and resource type, read from `terraformUrl`. */
export type TerraformVersionInfo = {
  /** Registry address, e.g. `hashicorp/azurerm`. */
  source: string;
  /** Resource type as written in HCL, e.g. `azurerm_search_service`. */
  resourceType: string;
  /** Set when the documentation link is pinned to an older provider release. */
  pinnedVersion?: string;
  /** Latest published provider release, filled from the registry when reachable. */
  latestVersion?: string;
  latestPublishedAt?: string;
  registryUrl: string;
  changelogUrl: string;
};

/** Azure resource type and API version, read from a Bicep or ARM snippet. */
export type ApiVersionInfo = {
  /** e.g. `Microsoft.Search/searchServices`. */
  type: string;
  /** e.g. `2023-11-01` or `2024-03-01-preview`. */
  apiVersion: string;
  /** The `YYYY-MM-DD` part of the API version, i.e. when that contract was published. */
  date: string;
  preview: boolean;
};

export type SnippetVersions = {
  terraform?: TerraformVersionInfo;
  bicep?: ApiVersionInfo;
  arm?: ApiVersionInfo;
};

const TERRAFORM_URL =
  /registry\.terraform\.io\/providers\/([^/]+)\/([^/]+)\/([^/]+)\/docs\/resources\/([^/?#]+)/;

export function parseTerraformUrl(url: string | undefined): TerraformVersionInfo | undefined {
  const match = url?.match(TERRAFORM_URL);
  if (!match) return undefined;
  const [, namespace, name, version, resource] = match;
  return {
    source: `${namespace}/${name}`,
    resourceType: `${name}_${resource}`,
    pinnedVersion: version === 'latest' ? undefined : version,
    registryUrl: `https://registry.terraform.io/providers/${namespace}/${name}/latest`,
    // Every provider repository follows the terraform-provider-<name> convention.
    changelogUrl: `https://github.com/${namespace}/terraform-provider-${name}/blob/main/CHANGELOG.md`,
  };
}

function toApiVersionInfo(type: string, apiVersion: string): ApiVersionInfo | undefined {
  const date = apiVersion.match(/^\d{4}-\d{2}-\d{2}/)?.[0];
  if (!date) return undefined;
  return { type, apiVersion, date, preview: /preview/i.test(apiVersion) };
}

/** First `resource x 'Microsoft.X/y@<api>'` declaration of a Bicep snippet. */
export function parseBicepApiVersion(code: string | undefined): ApiVersionInfo | undefined {
  const match = code?.match(/resource\s+\S+\s+'([^'@]+)@([^']+)'/);
  return match ? toApiVersionInfo(match[1], match[2]) : undefined;
}

/** First resource of an ARM template, whether the snippet is a template or a bare resource. */
export function parseArmApiVersion(code: string | undefined): ApiVersionInfo | undefined {
  const type = code?.match(/"type"\s*:\s*"([^"]+\/[^"]+)"/)?.[1];
  const apiVersion = code?.match(/"apiVersion"\s*:\s*"([^"]+)"/)?.[1];
  return type && apiVersion ? toApiVersionInfo(type, apiVersion) : undefined;
}

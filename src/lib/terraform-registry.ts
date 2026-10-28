/* src/lib/terraform-registry.ts
 *
 * Server-side reads of the public Terraform registry. Answers are cached by
 * Next for an hour, and any failure (offline, timeout, rate limit) resolves to
 * undefined: the registry only enriches a page, it never breaks one.
 */

import { logger } from '@/lib/logger';

export type ProviderRelease = {
  version: string;
  publishedAt: string;
};

/** Latest published release of `<namespace>/<name>`, e.g. `hashicorp/azurerm`. */
export async function fetchLatestProviderRelease(
  source: string
): Promise<ProviderRelease | undefined> {
  try {
    const response = await fetch(`https://registry.terraform.io/v1/providers/${source}`, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(3000),
    });
    if (!response.ok) {
      logger.warn('registry', `${source}: the registry answered ${response.status}`);
      return undefined;
    }
    const body = await response.json();
    if (typeof body?.version !== 'string') return undefined;
    return { version: body.version, publishedAt: String(body.published_at ?? '') };
  } catch (error) {
    logger.warn('registry', `${source}: the registry is unreachable`, error);
    return undefined;
  }
}

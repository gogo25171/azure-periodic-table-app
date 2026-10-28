'use client';

import type { ReactNode } from 'react';
import { Badge } from './ui/badge';
import { useLanguage } from '@/i18n/LanguageContext';
import type { ApiVersionInfo, TerraformVersionInfo } from '@/lib/snippet-versions';

const LINK = 'underline underline-offset-2 hover:text-foreground';

function useDates() {
  const { language } = useLanguage();
  const format = (iso: string) =>
    new Intl.DateTimeFormat(language, { dateStyle: 'medium', timeZone: 'UTC' }).format(
      new Date(iso)
    );
  const age = (iso: string) => {
    const months = Math.floor((Date.now() - new Date(iso).getTime()) / (30.44 * 86400000));
    const relative = new Intl.RelativeTimeFormat(language, { numeric: 'auto' });
    return months >= 12
      ? relative.format(-Math.floor(months / 12), 'year')
      : relative.format(-Math.max(months, 0), 'month');
  };
  return { format, age };
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="min-w-0 break-words">{children}</dd>
    </>
  );
}

function Frame({ children, footer }: { children: ReactNode; footer?: ReactNode }) {
  return (
    <div className="mb-4 rounded-md border border-border p-3 text-sm">
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">{children}</dl>
      {footer}
    </div>
  );
}

/** Provider, resource type and release facts of the Terraform tab. */
export function TerraformVersionInfoBox({ info }: { info: TerraformVersionInfo }) {
  const { t } = useLanguage();
  const { format, age } = useDates();

  return (
    <Frame
      footer={
        info.pinnedVersion && (
          <p className="mt-2 text-amber-600 dark:text-amber-400">
            {t('versions.pinned', { version: info.pinnedVersion })}
          </p>
        )
      }
    >
      <Row label={t('versions.provider')}>
        <a className={`font-mono ${LINK}`} href={info.registryUrl} target="_blank" rel="noreferrer">
          {info.source}
        </a>
      </Row>
      <Row label={t('versions.resourceType')}>
        <code className="font-mono">{info.resourceType}</code>
      </Row>
      {info.latestVersion && (
        <Row label={t('versions.latestRelease')}>
          <span className="font-mono">{info.latestVersion}</span>
          {info.latestPublishedAt && (
            <span className="text-muted-foreground">
              {' · '}
              {t('versions.publishedOn', {
                date: format(info.latestPublishedAt),
                age: age(info.latestPublishedAt),
              })}
            </span>
          )}
        </Row>
      )}
      <Row label={t('versions.changelog')}>
        <a className={LINK} href={info.changelogUrl} target="_blank" rel="noreferrer">
          CHANGELOG.md
        </a>
      </Row>
    </Frame>
  );
}

/** Azure resource type and API version of the Bicep and ARM tabs. */
export function ApiVersionInfoBox({ info }: { info: ApiVersionInfo }) {
  const { t } = useLanguage();
  const { format, age } = useDates();

  return (
    <Frame>
      <Row label={t('versions.azureType')}>
        <code className="font-mono">{info.type}</code>
      </Row>
      <Row label={t('versions.apiVersion')}>
        <span className="font-mono">{info.apiVersion}</span>
        {info.preview && (
          <Badge className="ml-2 bg-amber-500 text-white hover:bg-amber-500">
            {t('versions.preview')}
          </Badge>
        )}
      </Row>
      <Row label={t('versions.since')}>
        {format(info.date)}
        <span className="text-muted-foreground"> · {age(info.date)}</span>
      </Row>
    </Frame>
  );
}

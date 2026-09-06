'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Icons } from '@/components/ui/icons';
import { useTranslation } from '@/i18n/LanguageContext';
import { logger } from '@/lib/logger';
import type { AuditReport, Severity } from '@/lib/data-audit';

const SEVERITY_STYLES: Record<Severity, string> = {
  error: 'bg-red-500 hover:bg-red-500',
  warning: 'bg-amber-500 hover:bg-amber-500',
  info: 'bg-sky-500 hover:bg-sky-500',
};

export default function AdminPage() {
  const t = useTranslation();
  const [password, setPassword] = useState('');
  const [report, setReport] = useState<AuditReport | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [errorKey, setErrorKey] = useState<
    'admin.wrongPassword' | 'admin.notConfigured' | null
  >(null);
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [providerFilter, setProviderFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState<'all' | Severity>('all');

  useEffect(() => {
    fetch('/api/admin/audit')
      .then((response) => response.json())
      .then((body) => setConfigured(Boolean(body?.configured)))
      .catch((error) => {
        logger.error('admin', 'Unable to read the admin configuration', error);
        setConfigured(false);
      });
  }, []);

  const runAudit = useCallback(async () => {
    setStatus('loading');
    setErrorKey(null);
    try {
      const response = await fetch('/api/admin/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (response.status === 503) {
        setErrorKey('admin.notConfigured');
        setStatus('error');
        return;
      }
      if (!response.ok) {
        setErrorKey('admin.wrongPassword');
        setStatus('error');
        return;
      }

      setReport((await response.json()) as AuditReport);
      setStatus('idle');
    } catch (error) {
      logger.error('admin', 'The audit request failed', error);
      setErrorKey('admin.wrongPassword');
      setStatus('error');
    }
  }, [password]);

  const findings = useMemo(() => {
    if (!report) return [];
    return report.findings.filter(
      (finding) =>
        (providerFilter === 'all' || finding.provider === providerFilter) &&
        (severityFilter === 'all' || finding.severity === severityFilter)
    );
  }, [report, providerFilter, severityFilter]);

  return (
    <main className="min-h-screen w-full p-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Icons.ShieldAlert className="h-8 w-8" />
            <div>
              <h1 className="text-3xl font-bold">{t('admin.title')}</h1>
              <p className="text-sm text-muted-foreground">
                {t('admin.subtitle')}
              </p>
            </div>
          </div>
          <Link href="/">
            <Button variant="secondary">{t('admin.backToTable')}</Button>
          </Link>
        </div>

        {configured === false && (
          <Card>
            <CardContent className="pt-6 text-amber-600 dark:text-amber-400">
              {t('admin.notConfigured')}
            </CardContent>
          </Card>
        )}

        {!report ? (
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>{t('admin.password')}</CardTitle>
              <CardDescription>{t('admin.subtitle')}</CardDescription>
            </CardHeader>
            <CardContent>
              <form
                className="flex flex-col gap-4"
                onSubmit={(event) => {
                  event.preventDefault();
                  runAudit();
                }}
              >
                <div className="flex flex-col gap-2">
                  <Label htmlFor="admin-password">{t('admin.password')}</Label>
                  <Input
                    id="admin-password"
                    type="password"
                    autoComplete="current-password"
                    placeholder={t('admin.passwordPlaceholder')}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                </div>
                {errorKey && (
                  <p className="text-sm text-red-500">{t(errorKey)}</p>
                )}
                <Button type="submit" disabled={status === 'loading'}>
                  {status === 'loading' ? t('admin.checking') : t('admin.signIn')}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <SummaryCard
                label={t('admin.resources')}
                value={report.totals.resources}
              />
              <SummaryCard
                label={t('admin.errors')}
                value={report.totals.errors}
                tone="text-red-500"
              />
              <SummaryCard
                label={t('admin.warnings')}
                value={report.totals.warnings}
                tone="text-amber-500"
              />
              <SummaryCard
                label={t('admin.infos')}
                value={report.totals.infos}
                tone="text-sky-500"
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>{t('admin.summary')}</CardTitle>
                <CardDescription>
                  {new Date(report.generatedAt).toLocaleString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="py-2 pr-4">{t('admin.provider')}</th>
                      <th className="py-2 pr-4">{t('admin.resources')}</th>
                      <th className="py-2 pr-4">{t('admin.errors')}</th>
                      <th className="py-2 pr-4">{t('admin.warnings')}</th>
                      <th className="py-2 pr-4">{t('admin.infos')}</th>
                      <th className="py-2 pr-4">{t('sidebar.category')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.providers.map((provider) => (
                      <tr
                        key={provider.provider}
                        className="border-b border-border/50"
                      >
                        <td className="py-2 pr-4 font-medium">
                          {provider.provider}
                        </td>
                        <td className="py-2 pr-4">{provider.resources}</td>
                        <td className="py-2 pr-4 text-red-500">
                          {provider.errors}
                        </td>
                        <td className="py-2 pr-4 text-amber-500">
                          {provider.warnings}
                        </td>
                        <td className="py-2 pr-4 text-sky-500">
                          {provider.infos}
                        </td>
                        <td className="py-2 pr-4">
                          {provider.categories.length}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>

            <div className="flex flex-wrap items-end gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="provider-filter">{t('admin.provider')}</Label>
                <select
                  id="provider-filter"
                  className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                  value={providerFilter}
                  onChange={(event) => setProviderFilter(event.target.value)}
                >
                  <option value="all">{t('admin.allProviders')}</option>
                  {report.providers.map((provider) => (
                    <option key={provider.provider} value={provider.provider}>
                      {provider.provider}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="severity-filter">{t('admin.severity')}</Label>
                <select
                  id="severity-filter"
                  className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                  value={severityFilter}
                  onChange={(event) =>
                    setSeverityFilter(event.target.value as 'all' | Severity)
                  }
                >
                  <option value="all">{t('admin.allProviders')}</option>
                  <option value="error">{t('admin.errors')}</option>
                  <option value="warning">{t('admin.warnings')}</option>
                  <option value="info">{t('admin.infos')}</option>
                </select>
              </div>
              <Button
                variant="secondary"
                onClick={runAudit}
                disabled={status === 'loading'}
              >
                {status === 'loading' ? t('admin.checking') : t('admin.refresh')}
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setReport(null);
                  setPassword('');
                }}
              >
                {t('admin.signOut')}
              </Button>
            </div>

            <Card>
              <CardContent className="overflow-x-auto pt-6">
                {findings.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    {t('admin.noIssue')}
                  </p>
                ) : (
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="py-2 pr-4">{t('admin.severity')}</th>
                        <th className="py-2 pr-4">{t('admin.provider')}</th>
                        <th className="py-2 pr-4">{t('admin.rule')}</th>
                        <th className="py-2 pr-4">{t('admin.resource')}</th>
                        <th className="py-2 pr-4">{t('admin.message')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {findings.map((finding, index) => (
                        <tr
                          key={`${finding.rule}-${finding.resourceId}-${index}`}
                          className="border-b border-border/50 align-top"
                        >
                          <td className="py-2 pr-4">
                            <Badge
                              className={`text-white ${
                                SEVERITY_STYLES[finding.severity]
                              }`}
                            >
                              {finding.severity}
                            </Badge>
                          </td>
                          <td className="py-2 pr-4">{finding.provider}</td>
                          <td className="py-2 pr-4 font-mono text-xs">
                            {finding.rule}
                          </td>
                          <td className="py-2 pr-4">
                            {finding.resourceId ? (
                              <Link
                                className="underline"
                                href={`/resource/${finding.resourceId}`}
                              >
                                {finding.resourceId}
                              </Link>
                            ) : (
                              '—'
                            )}
                          </td>
                          <td className="py-2 pr-4">{finding.message}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </main>
  );
}

function SummaryCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone?: string;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className={`text-3xl font-bold ${tone ?? ''}`}>{value}</p>
      </CardContent>
    </Card>
  );
}

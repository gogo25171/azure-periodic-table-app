import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { auditProviders } from '@/lib/data-audit';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

const iconCache = new Map<string, boolean>();

/** Resolves an `icon` path from a data file against the public/ directory. */
function iconExists(_provider: string, iconPath: string): boolean {
  const cached = iconCache.get(iconPath);
  if (cached !== undefined) return cached;

  const relative = iconPath.replace(/^\/+/, '');
  const fullPath = path.join(process.cwd(), 'public', relative);
  const exists = fs.existsSync(fullPath);
  iconCache.set(iconPath, exists);
  return exists;
}

/** Lists public/<provider>/code/<language>/, read fresh on every audit. */
function listSnippetFiles(provider: string, language: string): string[] {
  const directory = path.join(process.cwd(), 'public', provider, 'code', language);
  return fs.existsSync(directory) ? fs.readdirSync(directory) : [];
}

/** Constant-time-ish comparison so the route does not leak the password length. */
function passwordMatches(candidate: string, expected: string): boolean {
  if (candidate.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < candidate.length; i += 1) {
    diff |= candidate.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0;
}

/** Without ADMIN_PASSWORD the admin API answers as if it did not exist. */
function notFound() {
  return NextResponse.json({ error: 'not-found' }, { status: 404 });
}

/** Tells the client whether the admin interface is usable at all. */
export async function GET() {
  if (!process.env.ADMIN_PASSWORD) return notFound();
  return NextResponse.json({ configured: true });
}

export async function POST(request: Request) {
  const expected = process.env.ADMIN_PASSWORD;

  if (!expected) {
    logger.warn('admin', 'ADMIN_PASSWORD is not set, refusing the audit');
    return notFound();
  }

  let password = '';
  try {
    const body = await request.json();
    password = typeof body?.password === 'string' ? body.password : '';
  } catch {
    return NextResponse.json({ error: 'bad-request' }, { status: 400 });
  }

  if (!passwordMatches(password, expected)) {
    logger.warn('admin', 'Rejected an audit request: wrong password');
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const report = auditProviders({ iconExists, listSnippetFiles });
  logger.info(
    'admin',
    `Audit finished: ${report.totals.errors} error(s), ${report.totals.warnings} warning(s)`
  );

  return NextResponse.json(report);
}

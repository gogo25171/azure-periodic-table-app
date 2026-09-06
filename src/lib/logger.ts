/* src/lib/logger.ts */

/**
 * Minimal leveled logger shared by the client and the server.
 *
 * The level is read from NEXT_PUBLIC_LOG_LEVEL (silent | error | warn | info | debug).
 * It defaults to `warn` in production and `info` in development, so day to day
 * usage stays quiet while `debug` can be turned on without touching the code.
 */

const LEVELS = ['silent', 'error', 'warn', 'info', 'debug'] as const;

export type LogLevel = (typeof LEVELS)[number];

function resolveLevel(): LogLevel {
  const configured = process.env.NEXT_PUBLIC_LOG_LEVEL as LogLevel | undefined;
  if (configured && LEVELS.includes(configured)) return configured;
  return process.env.NODE_ENV === 'production' ? 'warn' : 'info';
}

const activeLevel = resolveLevel();
const threshold = LEVELS.indexOf(activeLevel);

function enabled(level: Exclude<LogLevel, 'silent'>): boolean {
  return LEVELS.indexOf(level) <= threshold;
}

function format(scope: string, message: string): string {
  return `[periodic-table:${scope}] ${message}`;
}

export const logger = {
  level: activeLevel,
  error(scope: string, message: string, ...details: unknown[]) {
    if (enabled('error')) console.error(format(scope, message), ...details);
  },
  warn(scope: string, message: string, ...details: unknown[]) {
    if (enabled('warn')) console.warn(format(scope, message), ...details);
  },
  info(scope: string, message: string, ...details: unknown[]) {
    if (enabled('info')) console.info(format(scope, message), ...details);
  },
  debug(scope: string, message: string, ...details: unknown[]) {
    if (enabled('debug')) console.debug(format(scope, message), ...details);
  },
};

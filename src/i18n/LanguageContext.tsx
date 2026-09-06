'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from 'react';
import {
  dictionaries,
  isLanguage,
  Language,
  TranslationKey,
} from './dictionaries';
import { logger } from '@/lib/logger';

const STORAGE_KEY = 'periodic-table.language';

export const DEFAULT_LANGUAGE: Language = isLanguage(
  process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE
)
  ? (process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE as Language)
  : 'en';

type Translate = (
  key: TranslationKey,
  variables?: Record<string, string | number>
) => string;

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: Translate;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // The first render must match the server output, so the stored preference is
  // only applied once the component is mounted on the client.
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (isLanguage(stored)) {
        setLanguageState(stored);
        return;
      }
      const fromBrowser = window.navigator.language.slice(0, 2);
      if (isLanguage(fromBrowser)) setLanguageState(fromBrowser);
    } catch (error) {
      logger.warn('language', 'Unable to read the stored language', error);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = useCallback((next: Language) => {
    setLanguageState(next);
    logger.info('language', `Language switched to ${next}`);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch (error) {
      logger.warn('language', 'Unable to persist the language', error);
    }
  }, []);

  const t = useCallback<Translate>(
    (key, variables) => {
      const dictionary = dictionaries[language] ?? dictionaries[DEFAULT_LANGUAGE];
      let value = dictionary[key] ?? dictionaries.en[key];

      if (value === undefined) {
        logger.warn('i18n', `Missing translation for "${key}" (${language})`);
        return key;
      }

      if (variables) {
        for (const [name, replacement] of Object.entries(variables)) {
          value = value.replaceAll(`{${name}}`, String(replacement));
        }
      }
      return value;
    },
    [language]
  );

  const value = useMemo(
    () => ({ language, setLanguage, t }),
    [language, setLanguage, t]
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

/** Shortcut for components that only need the translate function. */
export function useTranslation() {
  return useLanguage().t;
}

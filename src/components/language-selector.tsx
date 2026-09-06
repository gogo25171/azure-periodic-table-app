'use client';

import { useLanguage } from '@/i18n/LanguageContext';
import { LANGUAGES, LANGUAGE_LABELS, type Language } from '@/i18n/dictionaries';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Icons } from './ui/icons';

export default function LanguageSelector({
  variant = 'icon',
}: {
  /** `icon` for the desktop navbar, `full` for the mobile sheet. */
  variant?: 'icon' | 'full';
}) {
  const { language, setLanguage, t } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant === 'full' ? 'ghost' : 'ghost'}
          aria-label={t('language.label')}
          className={
            variant === 'full'
              ? 'w-full flex justify-start items-center my-2'
              : ''
          }
        >
          <Icons.Languages
            className={variant === 'full' ? 'h-6 w-6' : 'h-5 w-5'}
          />
          {variant === 'full' && (
            <span className="px-4 font-bold text-lg">
              {LANGUAGE_LABELS[language]}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LANGUAGES.map((code: Language) => (
          <DropdownMenuItem
            key={code}
            onClick={() => setLanguage(code)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <span>{LANGUAGE_LABELS[code]}</span>
            {language === code && <Icons.Check className="h-4 w-4 ml-auto" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

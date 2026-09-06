import Link from 'next/link';
import { Button } from './ui/button';
import { Icons } from './ui/icons';
import Image from 'next/image';
import { brandConfig, socialLinksConfig } from '@/config';
import { prefix } from '@/prefix';
import { useTheme } from 'next-themes';
import { themes } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { Sheet, SheetContent } from './ui/sheet';
import CloudProviderSelector from './cloud-provider-selector';
import LanguageSelector from './language-selector';
import { useTranslation } from '@/i18n/LanguageContext';
import type { TranslationKey } from '@/i18n/dictionaries';

type SocialLink = {
  key: keyof typeof socialLinksConfig;
  labelKey: TranslationKey;
  Icon: React.ComponentType<{ className?: string }>;
};

/**
 * Every social link is driven by `socialLinksConfig`, itself driven by the
 * NEXT_PUBLIC_SHOW_* / NEXT_PUBLIC_*_URL environment variables.
 */
const SOCIAL_LINKS: SocialLink[] = [
  { key: 'github', labelKey: 'header.github', Icon: Icons.GitHub },
  { key: 'linkedin', labelKey: 'header.linkedin', Icon: Icons.Linkedin },
  { key: 'twitter', labelKey: 'header.twitter', Icon: Icons.Twitter },
  { key: 'docs', labelKey: 'header.docs', Icon: Icons.BookOpen },
];

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const t = useTranslation();

  useEffect(() => {
    setMounted(true);
  }, []);

  const visibleLinks = SOCIAL_LINKS.filter(
    ({ key }) => socialLinksConfig[key].enabled
  );

  return (
    <nav className="flex w-full">
      <Sheet open={open} onOpenChange={() => setOpen((prev) => !prev)}>
        <SheetContent>
          <div className="flex flex-col w-full justify-center items-center">
            {visibleLinks.map(({ key, labelKey, Icon }) => (
              <Link
                key={key}
                className="flex w-full my-2 justify-start items-center"
                href={socialLinksConfig[key].url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant={'ghost'}>
                  <Icon className="h-6 w-6 fill-current" />
                  <span className="px-4 font-bold text-lg">{t(labelKey)}</span>
                </Button>
              </Link>
            ))}

            <LanguageSelector variant="full" />

            <Button
              onClick={() =>
                theme === themes.DARK
                  ? setTheme(themes.LIGHT)
                  : setTheme(themes.DARK)
              }
              variant={'ghost'}
              className="w-full flex justify-start items-center my-2"
            >
              {theme === themes.DARK ? (
                <div className="flex my-2 justify-start items-center">
                  {!mounted ? <div className="h-6 w-6" /> : <Icons.Moon className="h-6 w-6 fill-current" />}
                  <span className="px-4 font-bold text-lg">{t('header.darkMode')}</span>
                </div>
              ) : (
                <div className="flex my-2 justify-start items-center">
                  {!mounted ? <div className="h-6 w-6" /> : <Icons.Sun className="h-6 w-6 fill-current" />}
                  <span className="px-4 font-bold text-lg">{t('header.lightMode')}</span>
                </div>
              )}
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <Brand />
      <div className="flex ml-auto md:hidden">
        <Button
          onClick={() => setOpen((prev) => !prev)}
          variant={'ghost'}
          aria-label={t('header.menu')}
        >
          <Icons.Menu className="h-5 w-5 fill-current" />
        </Button>
      </div>

      <div className="ml-auto hidden md:flex items-center gap-2">
        <CloudProviderSelector />
        {visibleLinks.map(({ key, labelKey, Icon }) => (
          <a
            key={key}
            href={socialLinksConfig[key].url}
            target="_blank"
            rel="noopener noreferrer"
            referrerPolicy="no-referrer"
            aria-label={t(labelKey)}
          >
            <Button variant={'ghost'}>
              <Icon className="h-5 w-5 fill-current" />
            </Button>
          </a>
        ))}
        <LanguageSelector />
        <Button
          onClick={() =>
            theme === themes.DARK
              ? setTheme(themes.LIGHT)
              : setTheme(themes.DARK)
          }
          variant={'ghost'}
          aria-label={
            theme === themes.DARK ? t('header.lightMode') : t('header.darkMode')
          }
        >
          {!mounted ? (
            <div className="h-5 w-5" />
          ) : theme === themes.DARK ? (
            <Icons.Moon className="h-5 w-5 fill-current" />
          ) : (
            <Icons.Sun className="h-5 w-5 fill-current" />
          )}
        </Button>
      </div>
    </nav>
  );
}

/**
 * Logo and site title. Both halves, and the block itself, are driven by the
 * NEXT_PUBLIC_SHOW_BRAND* environment variables.
 */
function Brand() {
  if (!brandConfig.enabled) return null;

  const content = (
    <>
      {brandConfig.showLogo &&
        (brandConfig.logoUrl ? (
          <Image
            src={`${prefix}${brandConfig.logoUrl}`}
            alt={brandConfig.title}
            width={20}
            height={20}
            className="h-5 w-5 mr-2 object-contain"
          />
        ) : (
          <Icons.Logo className="h-5 w-5 text-black dark:text-white mr-2" />
        ))}
      {brandConfig.showTitle && (
        <span className="font-bold text-xl text-black dark:text-white">
          {brandConfig.title}
        </span>
      )}
    </>
  );

  if (brandConfig.href) {
    return (
      <Link
        className="flex justify-start items-center"
        href={brandConfig.href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {content}
      </Link>
    );
  }

  return <div className="flex justify-start items-center">{content}</div>;
}

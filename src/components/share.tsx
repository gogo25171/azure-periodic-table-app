import { Check, CopyIcon, Share as ShareIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Icons } from './ui/icons';
import { siteConfig, socialConfig, socialLinksConfig } from '@/config';
import { useEffect, useState } from 'react';
import { useTranslation } from '@/i18n/LanguageContext';

export function Share() {
  const [copied, setCopied] = useState(false);
  const t = useTranslation();

  // after 2 seconds have copied be false if active
  useEffect(() => {
    if (copied) {
      setTimeout(() => setCopied(false), 2000);
    }
  }, [copied]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={'secondary'}>
          <ShareIcon className="mr-2 w-4 h-4" />
          <span className="">{t('topbar.share')}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[520px]">
        <div className="flex flex-col space-y-2 text-center sm:text-left">
          <h3 className="text-lg font-semibold">{t('share.title')}</h3>
        </div>
        <div className="flex items-center space-x-2 pt-4">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              {t('share.link')}
            </Label>
            <Input
              id="link"
              defaultValue={siteConfig.url}
              readOnly
              autoFocus={false}
              className="h-9"
            />
          </div>
          <Button
            onClick={() => {
              navigator.clipboard.writeText(siteConfig.url);
              setCopied(true);
            }}
            size="sm"
            variant="secondary"
            className="px-3"
            aria-label={copied ? t('share.copied') : t('share.copy')}
          >
            {copied ? <Check width={16} /> : <CopyIcon width={16} />}
          </Button>
        </div>
        {(socialLinksConfig.twitter.enabled ||
          socialLinksConfig.linkedin.enabled) && (
          <div className="flex flex-col justify-center items-start">
            <div className="flex justify-center items-center my-4">
              {socialLinksConfig.twitter.enabled && (
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={socialConfig.twitter + socialConfig.tweet}
                >
                  <Button
                    variant={'outline'}
                    className="mx-2 flex justify-center items-center"
                  >
                    <Icons.Twitter className="h-4 w-4 fill-current mx-2" />
                    <span>{t('header.twitter')}</span>
                  </Button>
                </a>
              )}

              {socialLinksConfig.linkedin.enabled && (
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={socialConfig.linkedin}
                >
                  <Button
                    className="mx-2 flex justify-center items-center"
                    variant={'outline'}
                  >
                    <Icons.Linkedin className="h-4 w-4 fill-current mx-2" />
                    <span>{t('header.linkedin')}</span>
                  </Button>
                </a>
              )}
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

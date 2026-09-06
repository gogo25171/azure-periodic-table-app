import { Download as DownloadIcon } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';
import html2canvas from 'html2canvas';
import { useCloudProvider } from '@/contexts/CloudProviderContext';
import { useTranslation } from '@/i18n/LanguageContext';
import { logger } from '@/lib/logger';

export function Download() {
  const [isDownloading, setIsDownloading] = useState(false);
  const { provider } = useCloudProvider();
  const t = useTranslation();

  const downloadFile = async () => {
    const element = document.getElementById('exportable-table-container');
    if (!element) return;

    setIsDownloading(true);
    try {
      // html2canvas paints whatever is decoded at that instant, so icons that
      // are still loading (or that just fell back to the default one) would be
      // missing from the export. Wait for every image of the table first.
      await Promise.all(
        Array.from(element.querySelectorAll('img')).map((image) =>
          image.complete
            ? Promise.resolve()
            : new Promise<void>((resolve) => {
                image.addEventListener('load', () => resolve(), { once: true });
                image.addEventListener('error', () => resolve(), { once: true });
              })
        )
      );

      const canvas = await html2canvas(element, {
        backgroundColor: '#000000', // Matches the dark theme background
        scale: 2, // Higher resolution
        useCORS: true,
        allowTaint: true,
      });
      const url = canvas.toDataURL('image/png');

      const a = document.createElement('a');
      a.href = url;
      a.download = `${provider}-periodic-table.png`;
      a.click();
    } catch (error) {
      logger.error('download', 'Failed to generate the table image', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Button
      variant={'secondary'}
      onClick={() => {
        downloadFile();
      }}
      disabled={isDownloading}
      className="mx-2 flex"
    >
      <DownloadIcon className="w-4 h-4" />
      <span className="ml-2">
        {isDownloading ? t('topbar.downloading') : t('topbar.download')}
      </span>
    </Button>
  );
}


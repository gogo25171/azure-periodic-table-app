import { Download as DownloadIcon } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';
import html2canvas from 'html2canvas';
import { useCloudProvider } from '@/contexts/CloudProviderContext';

export function Download() {
  const [isDownloading, setIsDownloading] = useState(false);
  const { provider } = useCloudProvider();

  const downloadFile = async () => {
    const element = document.getElementById('exportable-table-container');
    if (!element) return;

    setIsDownloading(true);
    try {
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
      console.error('Failed to generate image', error);
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
      <span className="ml-2">{isDownloading ? 'Exporting...' : 'Download'}</span>
    </Button>
  );
}


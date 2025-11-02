'use client';

import { useCloudProvider, CloudProvider } from '@/contexts/CloudProviderContext';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Icons } from './ui/icons';

const providerConfig = {
  azure: {
    name: 'Azure',
    icon: Icons.Azure,
    color: 'text-blue-500',
  },
  aws: {
    name: 'AWS',
    icon: Icons.AWS,
    color: 'text-orange-500',
  },
  google: {
    name: 'Google Cloud',
    icon: Icons.Google,
    color: 'text-red-500',
  },
};

export default function CloudProviderSelector() {
  const { provider, setProvider } = useCloudProvider();
  const currentProvider = providerConfig[provider];
  const CurrentIcon = currentProvider.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <CurrentIcon className="h-5 w-5" />
          <span className="hidden md:inline">{currentProvider.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {(Object.keys(providerConfig) as CloudProvider[]).map((key) => {
          const config = providerConfig[key];
          const ProviderIcon = config.icon;
          return (
            <DropdownMenuItem
              key={key}
              onClick={() => setProvider(key)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <ProviderIcon className="h-4 w-4" />
              <span>{config.name}</span>
              {provider === key && <Icons.Check className="h-4 w-4 ml-auto" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

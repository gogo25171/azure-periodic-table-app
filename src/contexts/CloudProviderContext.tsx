'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export type CloudProvider = 'azure' | 'aws' | 'google' | 'ovh' | 'scaleway';

interface CloudProviderContextType {
  provider: CloudProvider;
  setProvider: (provider: CloudProvider) => void;
}

const CloudProviderContext = createContext<CloudProviderContextType | undefined>(
  undefined
);

export function CloudProviderProvider({ children }: { children: ReactNode }) {
  const [provider, setProvider] = useState<CloudProvider>('azure'); // Provider by default is 'azure'

  return (
    <CloudProviderContext.Provider value={{ provider, setProvider }}>
      {children}
    </CloudProviderContext.Provider>
  );
}

export function useCloudProvider() {
  const context = useContext(CloudProviderContext);
  if (context === undefined) {
    throw new Error('useCloudProvider must be used within a CloudProviderProvider');
  }
  return context;
}

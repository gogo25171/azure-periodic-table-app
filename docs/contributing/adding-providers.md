# Adding new providers

Looking at providers like "Azure" as an example, you can add other cloud providers like AWS, Google Cloud, OVH, etc.

To add a new cloud provider to the periodic table, follow these steps:

#### 1. Create the data file

Create a new TypeScript file in `src/app/data/` named after your provider (e.g., `your-provider.ts`). This file must export:

- An `Item` type defining the structure of each resource
- A `ColumnType` defining the structure of columns
- A `columns` array containing all resources organized by columns

Example structure:

```typescript
export type Item = {
  id: string;
  name: string;
  slug: string;
  description: string;
  length: string;
  category: Categories;
  learnUrl: string;
  terraformUrl: string;
  restrictions: string;
  icon: string;
  terraformCode: string;
  // ... other optional properties
};

export type ColumnType = {
  items: Item[];
};

export const columns: ColumnType[] = [
  {
    items: [
      // Your resources here
    ]
  }
];
```

#### 2. Add provider icons

Add the provider's icon in the `Icons` object in `src/components/ui/icons.tsx`:

```typescript
export const Icons = {
  // ... existing icons
  YourProvider: (props: LucideProps) => (
    <svg viewBox="..." {...props}>
      {/* Your SVG content */}
    </svg>
  ),
};
```

#### 3. Update the CloudProviderContext

In `src/contexts/CloudProviderContext.tsx`, add your provider to the `CloudProvider` type:

```typescript
export type CloudProvider = 'azure' | 'aws' | 'google' | 'your-provider';
```

#### 4. Update the table wrapper

In `src/components/table-wrapper.tsx`:

- Import your data file:

  ```typescript
  import * as yourProviderData from '../app/data/your-provider';
  ```

- Add your provider to `providerData`:

  ```typescript
  const providerData = {
    azure: azureData,
    aws: awsData,
    google: googleData,
    'your-provider': yourProviderData,
  };
  ```

- Add your provider configuration to `providerConfig`:

  ```typescript
  const providerConfig = {
    // ... existing providers
    'your-provider': {
      title: 'The Your Provider Periodic Table',
      subtitle: 'Bringing together core Your Provider content to supercharge your productivity.',
      subtitleMobile: 'Supercharge your productivity in Your Provider.',
      icon: Icons.YourProvider,
    },
  };
  ```

#### 5. Update the cloud provider selector

In `src/components/cloud-provider-selector.tsx`, add your provider to `providerConfig`:

```typescript
const providerConfig = {
  // ... existing providers
  'your-provider': {
    name: 'Your Provider',
    icon: Icons.YourProvider,
    color: 'text-your-color',
  },
};
```

#### 6. Update the sidebar dynamic texts

In `src/components/sidebar.tsx`, add your provider to the conditional logic inside the `Sidebar` component to dynamically adjust the UI text, icons, and AI prompt for your cloud provider:

```typescript
  } else if (provider === 'your-provider') {
    docText = isMobile ? 'Docs' : 'Your Provider Docs';
    costText = isMobile ? 'Cost' : 'Your Provider Pricing';
    ProviderIcon = Icons.YourProvider;
    ProviderCloudIcon = Icons.YourProvider;
    portalText = isMobile ? 'Console' : 'Your Provider Console';
    shellText = isMobile ? 'Shell' : 'Your Provider Shell';
    providerName = 'Your Provider';
  }
```

#### 7. Add resource icons

Place all your resource icons in the appropriate subfolder under `public/your-provider/icons/` organized by category (e.g., Compute, Networking, Storage, etc.).

#### 8. Test your implementation

1. Start the development server: `yarn dev`
2. Navigate to <http://localhost:3000>
3. Select your provider from the dropdown menu
4. Verify that all resources display correctly with their icons and information

---
*Dernière mise à jour : 22 avril 2026*

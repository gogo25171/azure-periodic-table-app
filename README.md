# Azure Periodic Table

The Azure Periodic Table is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app). This application serves as an interactive and intuitive way to explore Azure resources. It offers details about each service, their naming restrictions and conventions, and provides useful code snippets in Terraform. Whether you are new to Azure or an experienced user, this project aims to be a helpful reference for managing and provisioning Azure resources.

## Pre-requisites

- Node.js (v12.0.0 or higher)
- npm (v6.0.0 or higher) or Yarn (v1.22.0 or higher)

If you don't have Yarn installed, you can install it by following the instructions on the official [Yarn website](https://classic.yarnpkg.com/en/docs/install), or install it via npm:

```bash
npm install -g yarn
```

## Installation

Before starting the server, you must install the necessary dependencies. Navigate to the project directory and run:

```bash
yarn install
```

> **Note**: Skipping this step will result in errors like `next: not found` when trying to start the development server.

## Configuration

### Disabling the AI Chat Feature
To disable the AI Chat feature in the application, you can set the `ENABLE_CHAT` variable to `false` in `src/app/constants.ts`:

```typescript
export const ENABLE_CHAT = false;
```

## Getting Started

After installing the dependencies, you can start the development server:

```bash
yarn dev
```

Open <http://localhost:3000> with your browser to see the result.

You can start editing the page by modifying app/page.tsx. The page auto-updates as you edit the file.

This project uses [next/font](https://nextjs.org/docs/pages/building-your-application/optimizing/fonts) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn/foundations/about-nextjs) - an interactive Next.js tutorial.
  You can check out the Next.js GitHub repository - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy this Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.

## Deploy with Docker

This guide will walk you through the steps to deploy this application using Docker.

### Prerequisites

Before you start, ensure you have the following installed:

- [Docker](https://docs.docker.com/engine/install/) - Download and install Docker for your operating system.

### Getting Started

1. Clone the docker image:

```bash
docker pull onwardplatforms/azure-periodic-table-dockerversion
```

2. Once you pulled the image, use the below command to check the docker images

```bash
docker images
```

3. Once the image shows up, it's time to run the image on your docker engine.

```bash
docker run -d -p 3000:3000 <docker-imageid>
```

4. Please use the below command to verify the DockerImage is running sucessfully.

```bash
docker ps -a
```

## How to contribute

### Adding new providers

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

## Credit

AWS svg icon: https://github.com/weibeld/aws-icons-svg/blob/main/misc/aws/AWS_80.svg

Google Cloud svg icon: Copilot / Claude Code 4.5

Azure svg icon: Base in the project 

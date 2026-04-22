# Adding new resources

To add a new resource (e.g., a new database, compute instance, or networking component) to an existing cloud provider, you only need to modify the provider's specific data file located in `src/app/data/` (for example, `azure.ts`, `aws.ts`, `ovh.ts`, etc.).

#### 1. Define the Resource Item

Each provider's data file exports a `columns` array. To add a new resource, you need to append a new `Item` object into one of the existing columns (or create a new column object if you want a new column in the grid).

Here is the full structure of the `Item` type:

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
  resource?: string;
  entity?: string;
  scope?: string;
  bicepCode?: string;
  armCode?: string;
  pricingReferenceUrl?: string;
  portalUrl?: string;
};
```

Here is a breakdown of the properties used to define a resource:

### Mandatory Properties
- `id`: A unique string identifier for the resource (e.g., `ovh-public-cloud-instance`).
- `name`: The display name of the resource in the periodic table.
- `slug`: The prefix or common naming convention for this resource (e.g., `vm-`).
- `description`: A short explanation of what the resource does.
- `length`: The allowed character length for the resource name (e.g., `1-63`).
- `category`: The category the resource belongs to (using the `Categories` enum).
- `learnUrl`: URL to the official cloud provider documentation.
- `terraformUrl`: URL to the Terraform registry documentation for the resource.
- `restrictions`: Allowed characters for the resource name (e.g., 'Alphanumerics and hyphens').
- `icon`: Path to the resource's specific icon (can be left empty `''` if no icon is available).
- `terraformCode`: A string containing a functional Terraform code snippet for deployment.

### Optional Properties (`?`)
- `resource`: The provider's internal resource namespace.
- `entity`: The specific entity type.
- `scope`: The scope of the resource deployment (e.g., `project`, `global`, `tenant`).
- `bicepCode`: A Bicep code snippet (mainly used for Azure).
- `armCode`: An ARM template code snippet (mainly used for Azure).
- `pricingReferenceUrl`: URL to the pricing page for the resource.
- `portalUrl`: URL to the cloud console or manager to deploy the resource manually.
- `dnsConfiguration`: Advanced DNS configuration objects (mainly used for Azure Private Endpoints).

#### 2. Add resource icons

If you specified an `icon` path in your `Item`, make sure to place the actual icon image file in the appropriate subfolder under `public/<provider-name>/icons/`, organized by category (e.g., Compute, Networking, Storage, etc.).

#### 3. Test your addition

1. Start the development server: `yarn dev`
2. Navigate to <http://localhost:3000>
3. Select the appropriate provider from the dropdown menu
4. Verify that your new resource displays correctly on the periodic table grid and that its details appear correctly in the sidebar when clicked.

---
*Dernière mise à jour : 22 avril 2026*

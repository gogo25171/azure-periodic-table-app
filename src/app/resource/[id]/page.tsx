import * as azureData from '@/app/data/azure';
import * as awsData from '@/app/data/aws';
import * as googleData from '@/app/data/google';
import * as ovhData from '@/app/data/ovh';
import * as scalewayData from '@/app/data/scaleway';
import Sidebar from '@/components/sidebar';
import {
  parseArmApiVersion,
  parseBicepApiVersion,
  parseTerraformUrl,
  type SnippetVersions,
} from '@/lib/snippet-versions';
import { fetchLatestProviderRelease } from '@/lib/terraform-registry';
import fs from 'fs';
import path from 'path';

const providers = [
  { id: 'azure', data: azureData },
  { id: 'aws', data: awsData },
  { id: 'google', data: googleData },
  { id: 'ovh', data: ovhData },
  { id: 'scaleway', data: scalewayData },
];

// Next 15 passes the route params as a promise.
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id: paramsId } = await params;

  // Find which cloud provider this resource belongs to
  let cloud = '';
  let activeElement: any = null;

  for (const provider of providers) {
    const found = provider.data.columns
      .flatMap((column) => column.items)
      .find((item) => item.id === paramsId);
    
    if (found) {
      cloud = provider.id;
      activeElement = found;
      break;
    }
  }

  if (!activeElement) {
    return null;
  }

  const terraformFilePath = path.join(process.cwd(), 'public', cloud, 'code', 'terraform', `${paramsId}.tf`);
  const bicepFilePath = path.join(process.cwd(), 'public', cloud, 'code', 'bicep', `${paramsId}.bicep`);
  const armFilePath = path.join(process.cwd(), 'public', cloud, 'code', 'arm', `${paramsId}.json`);

  let terraformCodeSnippet = activeElement.terraformCode || '';
  let bicepCodeSnippet = activeElement.bicepCode || '';
  let armCodeSnippet = activeElement.armCode || '';

  // Read Terraform file
  try {
    if (fs.existsSync(terraformFilePath)) {
      terraformCodeSnippet = fs.readFileSync(terraformFilePath, 'utf8');
    }
  } catch (err) {
    console.error(`Failed to read Terraform file for ${paramsId}`);
  }

  // Read Bicep file
  try {
    if (fs.existsSync(bicepFilePath)) {
      bicepCodeSnippet = fs.readFileSync(bicepFilePath, 'utf8');
    }
  } catch (err) {
    console.error(`Failed to read Bicep file for ${paramsId}`);
  }

  // Read ARM file
  try {
    if (fs.existsSync(armFilePath)) {
      armCodeSnippet = fs.readFileSync(armFilePath, 'utf8');
    }
  } catch (err) {
    console.error(`Failed to read ARM file for ${paramsId}`);
  }

  const elementWithCodeSnippet = {
    ...activeElement,
    terraformCode: terraformCodeSnippet,
    bicepCode: bicepCodeSnippet,
    armCode: armCodeSnippet,
  };

  const terraform = parseTerraformUrl(activeElement.terraformUrl);
  const latest = terraform && (await fetchLatestProviderRelease(terraform.source));
  const versions: SnippetVersions = {
    terraform: terraform && {
      ...terraform,
      latestVersion: latest?.version,
      latestPublishedAt: latest?.publishedAt,
    },
    bicep: parseBicepApiVersion(bicepCodeSnippet),
    arm: parseArmApiVersion(armCodeSnippet),
  };

  return (
    <Sidebar activeElement={elementWithCodeSnippet} provider={cloud} versions={versions} />
  );
}

import * as azureData from '@/app/data/azure';
import * as awsData from '@/app/data/aws';
import * as googleData from '@/app/data/google';
import * as ovhData from '@/app/data/ovh';
import * as scalewayData from '@/app/data/scaleway';
import Sidebar from '@/components/sidebar';
import fs from 'fs';
import path from 'path';

const providers = [
  { id: 'azure', data: azureData },
  { id: 'aws', data: awsData },
  { id: 'google', data: googleData },
  { id: 'ovh', data: ovhData },
  { id: 'scaleway', data: scalewayData },
];

export default function Page({ params }: { params: { id: string } }) {
  const paramsId = params.id;

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

  return <Sidebar activeElement={elementWithCodeSnippet} provider={cloud} />;
}

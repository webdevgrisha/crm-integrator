import {SecretManagerServiceClient} from "@google-cloud/secret-manager";

const projectId = "crm-synchronisation";
const versionId = "latest";

async function getSecret(secretName: string): Promise<string> {
  const client = new SecretManagerServiceClient();
  const [version] = await client.accessSecretVersion({
    name: `projects/${projectId}/secrets/${secretName}/versions/${versionId}`,
  });

  const secret: string | undefined = version?.payload?.data?.toString();

  if (!secret) {
    throw new Error("API key is not set.");
  }

  console.log(`Successfully fetched secret: ${secretName}`);

  return secret;
}

export {getSecret};

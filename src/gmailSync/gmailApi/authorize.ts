/* eslint-disable @typescript-eslint/no-explicit-any, camelcase, max-len */
import {google} from "googleapis";
import {getSecret} from "../../utils/getSecret";
import {gmailConfig} from "../../projectConfig";

async function authorize(): Promise<any> {
  try {
    const credentials = JSON.parse(
      await getSecret(gmailConfig.gmailApiSecretConfig.credentialsName)
    );
    const token = JSON.parse(
      await getSecret(gmailConfig.gmailApiSecretConfig.tokenName)
    );

    const {client_id, client_secret, redirect_uris} = credentials.installed;

    if (!client_id || !client_secret || !redirect_uris || !redirect_uris[0]) {
      throw new Error("Missing necessary OAuth2 credentials");
    }

    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    if (!token || !token.access_token) {
      throw new Error("Invalid or missing token");
    }

    oAuth2Client.setCredentials(token);

    return oAuth2Client;
  } catch (error) {
    console.error("Error during OAuth2 authorization:", error);

    throw new Error("OAuth2 authorization failed");
  }
}

export {authorize};

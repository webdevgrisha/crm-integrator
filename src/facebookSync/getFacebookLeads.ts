import * as bizSdk from "facebook-nodejs-business-sdk";
import { getSecret } from "../utils/getSecret";
import { facebookConfig } from "../projectConfig";
import { FacebookApiSecret, FacebookLeadData } from "./interfaces";
import { getLeadgenForms } from "./getLeadgenForms";
import { getFormLeads } from "./getFormLeads";

async function getFacebookLeadsData(
  dateFrom: number,
  dateTo: number
): Promise<FacebookLeadData[]> {
  const facebookApi = JSON.parse(
    await getSecret(facebookConfig.apiKeyName)
  ) as FacebookApiSecret;

  const api = bizSdk.FacebookAdsApi.init(facebookApi.access_token);

  const leadParams = {
    filtering: [
      {
        field: "time_created",
        operator: "GREATER_THAN",
        value: dateFrom,
      },
      {
        field: "time_created",
        operator: "LESS_THAN",
        value: dateTo,
      },
    ],
  };

  try {
    const forms = await getLeadgenForms(facebookApi, api);
    const allLeads: FacebookLeadData[] = [];

    console.log(`[facebook] Fetching leads from ${forms.length} forms`);

    for (const form of forms) {
      const formLeads = await getFormLeads(form.id, leadParams);

      console.log(
        `[facebook] Fetched ${formLeads.length} records from form ` +
        `${form.id}${form.name ? ` (${form.name})` : ""}`
      );

      allLeads.push(...formLeads);
    }

    return allLeads;
  } catch (error) {
    console.error("Error fetching leads:", error);

    throw new Error("Error when getFacebookLeadsData");
  }
}

export {
  getFacebookLeadsData,
};

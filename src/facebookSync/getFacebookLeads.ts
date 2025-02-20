import * as bizSdk from "facebook-nodejs-business-sdk";
import {getSecret} from "../utils/getSecret";
import Cursor from "facebook-nodejs-business-sdk/src/cursor";
import {facebookConfig} from "../projectConfig";

const Ad = bizSdk.Ad;

async function getFacebookLeadsData(dateFrom: number, dateTo: number) {
  const facebookApi = JSON.parse(await getSecret(facebookConfig.apiKeyName));

  bizSdk.FacebookAdsApi.init(facebookApi.access_token);

  const params = {
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
    // facebookApi.id is the identifier of the Facebook Lead Ads form.
    // in this case the data is read from one form
    let leads: Cursor | null = await new Ad(facebookApi.id).getLeads(
      facebookConfig.formFields, params
    );

    const allLeads = [];

    while (leads) {
      allLeads.push(...leads);

      leads = leads.hasNext() ? await leads.next() : null;
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

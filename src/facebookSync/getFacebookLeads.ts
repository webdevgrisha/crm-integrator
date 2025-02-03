import * as bizSdk from "facebook-nodejs-business-sdk";
import {getSecret} from "../utils/getSecret";
import Cursor from "facebook-nodejs-business-sdk/src/cursor";

const Ad = bizSdk.Ad;

async function getFacebookLeadsData(dateFrom: number, dateTo: number) {
  const facebookApi = JSON.parse(await getSecret("facebook-api"));

  bizSdk.FacebookAdsApi.init(facebookApi.access_token);

  const fields = [
    "created_time",
    "ad_name",
    "campaign_name",
    "field_data",
  ];

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
    const leadss = await new Ad(facebookApi.id).getLeads(fields, params);

    const allLeads = [];
    let currPage: Cursor | null = leadss;

    do {
      allLeads.push(...leadss);

      if (currPage.hasNext()) {
        currPage = await currPage.next();
      } else {
        currPage = null;
      }
    } while (currPage);

    return allLeads;
  } catch (error) {
    console.error("Error fetching leads:", error);

    throw new Error("Error when getFacebookLeadsData");
  }
}

export {
  getFacebookLeadsData,
};

import * as bizSdk from "facebook-nodejs-business-sdk";
import {
  FacebookApiSecret,
  FacebookLeadgenForm,
  FacebookLeadgenFormsResponse,
} from "./interfaces";
import {facebookConfig} from "../projectConfig";

async function getLeadgenForms(
  facebookApi: FacebookApiSecret,
  api: bizSdk.FacebookAdsApi
): Promise<FacebookLeadgenForm[]> {
  const forms: FacebookLeadgenForm[] = [];
  let response = await api.call(
    "GET",
    [facebookApi.page_id, facebookConfig.leadgenFormsEdge],
    facebookConfig.leadgenFormsParams
  );

  while (response) {
    const responseData = response as FacebookLeadgenFormsResponse;

    const currentForms = responseData.data || [];
    const activeForms = currentForms.filter((form) => form.status === "ACTIVE");

    forms.push(...activeForms);

    const after = responseData.paging?.cursors?.after;

    if (!after) {
      response = null;
      continue;
    }

    response = await api.call(
      "GET",
      [facebookApi.page_id, facebookConfig.leadgenFormsEdge],
      {...facebookConfig.leadgenFormsParams, after}
    );
  }

  return forms;
}

export {getLeadgenForms};

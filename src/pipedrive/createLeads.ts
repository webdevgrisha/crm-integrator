import {pipedriveConfig} from "../projectConfig";
import {ChannelNames} from "../types";
import {getSecret} from "../utils/getSecret";
/* eslint-disable @typescript-eslint/no-var-requires */
const pipedrive = require("pipedrive");
/* eslint-enable @typescript-eslint/no-var-requires */


async function createLead(
  title: string,
  personId: number,
  channelName: ChannelNames,
  utmSource: string | null = null,
  utmCampaign: string | null = null,
  budget: string | null = "0",
  carName: string | null = null,
  carDescription: string | null = null,
) {
  try {
    const apiKey = await getSecret(pipedriveConfig.apiKeyName);

    const leadConfig = pipedriveConfig.leadConfig;

    const defaultClient = new pipedrive.ApiClient();
    defaultClient.authentications.api_key.apiKey = apiKey;

    const fieldsApi = new pipedrive.DealFieldsApi(defaultClient);
    const api = new pipedrive.LeadsApi(defaultClient);

    // custom fields
    const leadCarField = await fieldsApi.getDealField(
      leadConfig.customFields.leadCarField
    );
    const leadCarDescriptionField = await fieldsApi.getDealField(
      leadConfig.customFields.leadCarDescriptionField
    );
    const utmCampaignField = await fieldsApi.getDealField(
      leadConfig.customFields.utmCampaignField
    );

    const channelId = leadConfig.channelIds[channelName];

    const data = {
      title: title,
      value: {
        amount: Number(budget),
        currency: leadConfig.currency,
      },
      person_id: personId,
      channel: channelId,
      channel_id: utmSource,
      // visibility groups
      visible_to: leadConfig.visibleTo,
      // custom fields
      [leadCarField.data.key]: carName,
      [leadCarDescriptionField.data.key]: carDescription,
      [utmCampaignField.data.key]: utmCampaign,
      // was_seen: true
    };

    const response = await api.addLead(data);
    const leadId: string = response.data.id;

    console.log(`Created lead with ID: ${leadId}`);

    return leadId;
  } catch (err) {
    if (err instanceof Error) {
      console.error("Create a lead failed", err.message);

      throw new Error(`Create a lead failed: ${err.message}`);
    } else {
      console.error("Create a lead failed with unknown error", err);

      throw new Error(
        `Create a lead failed with an unknown error: ${(err as any)?.message}`
      );
    }
  }
}


export {createLead};

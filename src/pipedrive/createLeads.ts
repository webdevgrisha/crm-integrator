import { pipedriveConfig } from "../projectConfig";
import { ChannelNames } from "../types";
import { getSecret } from "../utils/getSecret";
/* eslint-disable @typescript-eslint/no-var-requires */
const pipedrive = require("pipedrive");
/* eslint-enable @typescript-eslint/no-var-requires */


interface CreateLeadFields {
  title: string;
  personId: number;
  channelName: ChannelNames;
  utmSource?: string | null;
  utmCampaign?: string | null;
  budget?: string | null;
  carName?: string | null;
  carDescription?: string | null;
}

async function createLead(
  createLeadFields: CreateLeadFields
) {
  const {
    title,
    personId,
    channelName,
    utmSource = null,
    utmCampaign = null,
    budget = "0",
    carName = null,
    carDescription = null,
  } = createLeadFields;


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


export { createLead };
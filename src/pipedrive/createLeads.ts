import {getSecret} from "../utils/getSecret";
/* eslint-disable @typescript-eslint/no-var-requires */
const pipedrive = require("pipedrive");
/* eslint-enable @typescript-eslint/no-var-requires */

type ChannelNames = "gmail" | "callback24" | "facebook"

const channelIds = {
  "callback24": 34,
  "gmail": 35,
  "facebook": 36,
};

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
    const apiKey = await getSecret("pipedrive-api");

    const defaultClient = new pipedrive.ApiClient();
    defaultClient.authentications.api_key.apiKey = apiKey;

    const fieldsApi = new pipedrive.DealFieldsApi(defaultClient);
    const api = new pipedrive.LeadsApi(defaultClient);

    const leadCarField = await fieldsApi.getDealField(41);
    const leadCarDescriptionField = await fieldsApi.getDealField(43);
    const utmCampaignField = await fieldsApi.getDealField(40);

    const channelId = channelIds[channelName];

    const data = {
      title: title,
      value: {
        amount: Number(budget),
        currency: "PLN",
      },
      person_id: personId,
      channel: channelId,
      channel_id: utmSource,
      visible_to: "1",
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

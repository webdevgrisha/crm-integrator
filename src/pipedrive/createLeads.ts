import {AddLeadRequest, LeadsApi} from "pipedrive/v1";
import {pipedriveConfig} from "../projectConfig";
import {ServiceNames} from "../enums";
import {LeadConfig} from "../projectConfig/pipedriveConfig/pipedriveConfig";
import {LeadFieldKeys} from "../projectConfig/pipedriveConfig/enums";
import {getPipedriveV1Config} from "./client";


interface CreateLeadFields {
  title: string;
  personId: number;
  serviceName: ServiceNames;
  utmSource?: string | null;
  utmCampaign?: string | null;
  utmTerm?: string | null;
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
    serviceName,
    utmSource = null,
    utmCampaign = null,
    utmTerm = null,
    budget = "0",
    carName = null,
    carDescription = null,
  } = createLeadFields;


  try {
    const leadConfig: LeadConfig = pipedriveConfig.leadConfig;
    const apiConfig = await getPipedriveV1Config();
    const api = new LeadsApi(apiConfig);

    const channelId: number = leadConfig.channelsId[serviceName];

    const data: AddLeadRequest & Record<string, unknown> = {
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
      [LeadFieldKeys.Car]: carName,
      [LeadFieldKeys.CarDescription]: carDescription,
      [LeadFieldKeys.UtmCampaign]: utmCampaign,
      [LeadFieldKeys.UtmTerm]: utmTerm,
      // was_seen: true
    };

    const response = await api.addLead({AddLeadRequest: data});
    const leadId = response.data?.id;

    if (!leadId) {
      throw new Error("Pipedrive did not return created lead ID");
    }

    console.log(`Created lead with ID: ${leadId}`);

    return leadId;
  } catch (err) {
    if (err instanceof Error) {
      console.error("Create a lead failed", err.message);

      throw new Error(`Create a lead failed: ${err.message}`);
    } else {
      console.error("Create a lead failed with unknown error", err);

      throw new Error(
        `Create a lead failed with an unknown error: ${err}`
      );
    }
  }
}


export {createLead};

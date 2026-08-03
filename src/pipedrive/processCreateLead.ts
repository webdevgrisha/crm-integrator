import {ServiceNames} from "../enums";
import {SavedLeads} from "../utils/filterSavedLeads";
import {createLead} from "./createLeads";
import {LeadObj} from "./interfaces";

interface ProcessCreateLeadData {
  id: string | number;
  phone: string;
  serviceName: ServiceNames;
  personId: number;
  savedLeads: SavedLeads;
  leadObj: LeadObj;
}

async function processCreateLead(
  data: ProcessCreateLeadData
) {
  const {id, phone, serviceName, personId, savedLeads, leadObj} = data;
  let leadId: string;
  const leadTitle = `${phone} - ${serviceName}`;

  if (savedLeads[id]?.createdLeadId) {
    leadId = savedLeads[id].createdLeadId as string;

    console.log(
      `[${serviceName}] Found existing lead with ID: ${leadId}`
    );
  } else {
    leadId = await createLead(
      {
        title: leadTitle,
        serviceName,
        personId,
        ...leadObj,
      }
    );
  }

  return leadId;
}

export {processCreateLead};

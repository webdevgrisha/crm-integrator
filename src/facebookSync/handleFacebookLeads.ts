import {getFacebookLeadsData} from "./getFacebookLeads";
import {FacebookProcessData, FacebookLeadData} from "./interfaces";
import {reformatFacebookLeads} from "./reformatFacebookLeads";

async function handleFacebookLeads(
  dateFrom: number,
  dateTo: number
) {
  try {
    const leads: FacebookLeadData[] =
      await getFacebookLeadsData(dateFrom, dateTo);

    const reformatLeads: FacebookProcessData[] = reformatFacebookLeads(leads);

    return reformatLeads;
  } catch (error) {
    console.error("Error handling Facebook leads:", error);

    throw new Error("Failed to handle Facebook leads");
  }
}

export {handleFacebookLeads};

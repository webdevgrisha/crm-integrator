import {getFacebookLeadsData} from "./getFacebookLeads";
import {reformatFacebookLeads} from "./reformatFacebookLeads";

async function handleFacebookLeads(dateFrom: number, dateTo: number) {
  try {
    const leads = await getFacebookLeadsData(dateFrom, dateTo);

    const reformatLeads = reformatFacebookLeads(leads);

    return reformatLeads;
  } catch (error) {
    console.error("Error handling Facebook leads:", error);

    throw new Error("Failed to handle Facebook leads");
  }
}

export {handleFacebookLeads};

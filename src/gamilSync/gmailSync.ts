// import {google} from "googleapis";
import {
  getDateFormats,
  getEpochTimeDateFrom,
  updateDateFrom,
} from "../utils/dateFuncs";
import {createPerson} from "../pipedrive/createPerson";
import {createLead} from "../pipedrive/createLeads";
import {onSchedule} from "firebase-functions/v2/scheduler";
import {delay} from "../utils/delay";
// import {handleGmailDataGmailApi} from "./handleGmailDataGmailApi";
// import {authorize} from "./authorize";
import {processSyncError, resetSyncErrorState} from "../utils/handleSyncError";
import {ProcessedLeadInfo} from "../interfaces";
import {saveProcessedLeadInfo} from "../utils/saveLeadInfo";
import {filterSavedLeads} from "../utils/filterSavedLeads";
import {handleGmailDataImap} from "./handleGmailDataImap";

async function syncGmail() {
  const serviceName = "gmail";
  const processedLeadsInfo: ProcessedLeadInfo[] = [];

  try {
    // const auth = await authorize();
    // const gmail = google.gmail({version: "v1", auth});

    const {
      epochTime: dateFromEpochTime,
      timestamp: dateFromTimestamp,
    } = await getEpochTimeDateFrom(serviceName);
    const {currentTimestamp, dateToEpochTime} = getDateFormats();

    // const gmailDataArr = await handleGmailDataGmailApi(
    //   gmail,
    //   dateFromEpochTime - 1,
    //   dateToEpochTime + 1
    // );

    const gmailDataArr = await handleGmailDataImap(
      dateFromEpochTime - 1,
      dateToEpochTime + 1
    );

    const savedLeads = await filterSavedLeads(serviceName, dateFromTimestamp);

    for (const data of gmailDataArr) {
      const {
        id,
        phone,
        email,
        car,
        budget,
        description,
        utmSource,
        utmCampaign,
      } = data;

      const processedLeadInfo: ProcessedLeadInfo = {
        serviceLeadId: id,
        createdPersonId: null,
        createdLeadId: null,
        dateFrom: dateFromTimestamp,
      };

      processedLeadsInfo.push(processedLeadInfo);

      let personId: number;

      if (String(id) in savedLeads && savedLeads[id].createdPersonId) {
        personId = savedLeads[id].createdPersonId as number;
      } else {
        personId = await createPerson(
          phone,
          email
        );
      }

      processedLeadInfo.createdPersonId = personId;
      await delay(200);

      const leadTitle = `${phone} - ${serviceName}`;

      const leadId = await createLead(
        leadTitle,
        personId,
        serviceName,
        utmSource,
        utmCampaign,
        budget,
        car,
        description
      );

      processedLeadInfo.createdLeadId = leadId;
      await delay(200);
    }

    await updateDateFrom(currentTimestamp, serviceName);

    await saveProcessedLeadInfo(processedLeadsInfo, serviceName);

    await resetSyncErrorState(serviceName);
  } catch (error) {
    // нужны ли туту await ?
    await processSyncError(serviceName);

    await saveProcessedLeadInfo(processedLeadsInfo, serviceName);

    throw new Error(`Sync ${serviceName} failed`);
  }
}

const scheduleGmailSync = onSchedule(
  {
    schedule: "5 * * * *",
    timeZone: "Europe/Warsaw",
    region: "europe-central2",
  },
  syncGmail
);

export {scheduleGmailSync};

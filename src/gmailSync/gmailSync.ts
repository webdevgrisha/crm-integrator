import {
  getDateFrom,
  getDateTo,
  updateDateFrom,
} from "../utils/dateFuncs";
import { createPerson } from "../pipedrive/createPerson";
import { createLead } from "../pipedrive/createLeads";
import { onSchedule } from "firebase-functions/v2/scheduler";
import { delay } from "../utils/delay";

// Gmail API
// import {handleGmailDataGmailApi} from "./handleGmailDataGmailApi";
// import {authorize} from "./authorize";
// import {google} from "googleapis";

// IMAP
import { handleGmailDataImap } from "./imap/handleGmailDataImap";

import { processSyncError, resetSyncErrorState } from "../utils/handleSyncError";
import { ProcessedLeadInfo } from "../interfaces";
import { saveProcessedLeadInfo } from "../utils/saveLeadInfo";
import { filterSavedLeads } from "../utils/filterSavedLeads";
import { gmailConfig } from "../projectConfig";

async function syncGmail() {
  const serviceName = gmailConfig.serviceName;
  const processedLeadsInfo: ProcessedLeadInfo[] = [];

  console.log(`[${serviceName}] Sync started`);

  try {
    const {
      dateFromTimestamp,
      dateFromIsoDate,
      dateFromEpochTime,
    } = await getDateFrom(serviceName);
    const {
      dateToTimestamp,
      dateToIsoFormat,
      dateToEpochTime,
    } = getDateTo();

    console.log(
      // eslint-disable-next-line max-len
      `[${serviceName}] Fetching data from ${dateFromIsoDate} to ${dateToIsoFormat}`
    );

    // Gmail API
    // const auth = await authorize();
    // const gmail = google.gmail({version: "v1", auth});

    // const gmailDataArr = await handleGmailDataGmailApi(
    //   gmail,
    //   dateFromEpochTime - 1,
    //   dateToEpochTime + 1
    // );


    // IMAP
    const gmailDataArr = await handleGmailDataImap(
      dateFromEpochTime - 1,
      dateToEpochTime + 1
    );

    console.log(`[${serviceName}] Fetched ${gmailDataArr.length} records`);

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

      console.log(`[${serviceName}] Processing lead with ID: ${id}`);

      const processedLeadInfo: ProcessedLeadInfo = {
        serviceLeadId: id,
        createdPersonId: null,
        createdLeadId: null,
        dateFrom: dateFromTimestamp,
      };

      processedLeadsInfo.push(processedLeadInfo);

      let personId: number;

      if (savedLeads?.[id].createdPersonId) {
        personId = savedLeads[id].createdPersonId as number;

        // eslint-disable-next-line max-len
        console.log(`[${serviceName}] Found existing person with ID: ${personId}`);
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

    await updateDateFrom(dateToTimestamp, serviceName);

    await saveProcessedLeadInfo(processedLeadsInfo, serviceName);

    await resetSyncErrorState(serviceName);

    console.log(`[${serviceName}] Sync completed successfully`);
  } catch (error) {
    // нужны ли туту await ?
    await processSyncError(serviceName);

    await saveProcessedLeadInfo(processedLeadsInfo, serviceName);

    throw new Error(`Sync ${serviceName} failed`);
  }
}

const scheduleGmailSync = onSchedule(
  {
    schedule: gmailConfig.schedule,
    timeZone: gmailConfig.timeZone,
    region: gmailConfig.region,
  },
  syncGmail
);

export { scheduleGmailSync };

import {
  getDateFrom,
  getDateTo,
  updateDateFrom,
} from "../utils/dateFuncs";
import {onSchedule} from "firebase-functions/v2/scheduler";

// Gmail API
// import {handleGmailDataGmailApi} from "./handleGmailDataGmailApi";
// import {authorize} from "./authorize";
// import {google} from "googleapis";

// IMAP
import {handleGmailDataImap} from "./imap/handleGmailDataImap";

import {handleSyncErrorState} from "../utils/handleSyncError";
import {ProcessedLeadInfo} from "../interfaces";
import {saveProcessedLeadInfo} from "../utils/saveLeadInfo";
import {gmailConfig} from "../projectConfig";
import {processLeads} from "../pipedrive/processLeads";

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

    await processLeads(serviceName, dateFromTimestamp, gmailDataArr);

    await updateDateFrom(dateToTimestamp, serviceName);

    await saveProcessedLeadInfo(processedLeadsInfo, serviceName);

    await handleSyncErrorState(serviceName, false);

    console.log(`[${serviceName}] Sync completed successfully`);
  } catch (error) {
    // нужны ли туту await  ?
    await handleSyncErrorState(serviceName, true);

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

export {scheduleGmailSync};

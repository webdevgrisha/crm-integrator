import {
  getDateFrom,
  getDateTo,
  updateDateFrom,
} from "../utils/dateFuncs";
import {onSchedule} from "firebase-functions/v2/scheduler";

// Gmail API
// import {gmail_v1, google} from "googleapis";
// import { OAuth2Client } from "google-auth-library";
// import { authorize } from "./gmailApi/authorize";
// import { handleGmailDataGmailApi } from "./gmailApi/handleGmailDataGmailApi";

// IMAP
import {handleGmailDataImap} from "./imap/handleGmailDataImap";

import {handleSyncErrorState} from "../utils/handleSyncError";
import {gmailConfig} from "../projectConfig";
import {processLeads} from "../pipedrive/processLeads";
import {ProcessedMail} from "./interfaces";
import {ServiceNames} from "../enums";


async function syncGmail(): Promise<void> {
  const serviceName: ServiceNames = gmailConfig.serviceName;

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
    // const gmail: gmail_v1.Gmail = google.gmail({version: "v1", auth});

    // const gmailDataArr: ProcessedMail[] = await handleGmailDataGmailApi(
    //   gmail,
    //   dateFromEpochTime - 1,
    //   dateToEpochTime + 1
    // );


    // IMAP
    const gmailDataArr: ProcessedMail[] = await handleGmailDataImap(
      dateFromEpochTime - 1,
      dateToEpochTime + 1
    );

    console.log(`[${serviceName}] Fetched ${gmailDataArr.length} records`);

    await processLeads(
      serviceName,
      dateFromTimestamp,
      gmailDataArr,
    );

    await updateDateFrom(dateToTimestamp, serviceName);

    await handleSyncErrorState(serviceName, false);

    console.log(`[${serviceName}] Sync completed successfully`);
  } catch (error) {
    await handleSyncErrorState(serviceName, true);

    throw new Error(`Sync ${serviceName} failed`);
  }
}

const scheduleGmailSync = onSchedule(
  {
    schedule: gmailConfig.cron.schedule,
    timeZone: gmailConfig.cron.timeZone,
    region: gmailConfig.cron.region,
  },
  syncGmail
);

export {scheduleGmailSync};

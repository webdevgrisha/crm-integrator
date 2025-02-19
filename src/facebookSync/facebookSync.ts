import {
  getDateFrom,
  getDateTo,
  updateDateFrom,
} from "../utils/dateFuncs";
import {onSchedule} from "firebase-functions/v2/scheduler";
import {handleFacebookLeads} from "./handleFacebookLeads";
import {processSyncError, resetSyncErrorState} from "../utils/handleSyncError";
import {ProcessedLeadInfo} from "../interfaces";
import {saveProcessedLeadInfo} from "../utils/saveLeadInfo";
import {facebookConfig} from "../projectConfig";
import { processLeads } from "../pipedrive/processLeads";

async function syncFacebook() {
  const serviceName = facebookConfig.serviceName;
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

    const facebookLeadsArr = await handleFacebookLeads(
      dateFromEpochTime - 1,
      dateToEpochTime + 1
    );

    console.log(`[${serviceName}] Fetched ${facebookLeadsArr.length} records`);

    await processLeads(serviceName,  dateFromTimestamp, facebookLeadsArr);

    await updateDateFrom(dateToTimestamp, serviceName);

    await saveProcessedLeadInfo(processedLeadsInfo, serviceName);

    await resetSyncErrorState(serviceName);

    console.log(`[${serviceName}] Sync completed successfully`);
  } catch (err) {
    // какая функция более важная:
    // отправить письмо или добавить обработанные лиды ?
    await processSyncError(serviceName);

    await saveProcessedLeadInfo(processedLeadsInfo, serviceName);

    throw new Error(`Sync ${serviceName} failed`);
  }
}

const scheduleFacebookSync = onSchedule(
  {
    schedule: facebookConfig.schedule,
    timeZone: facebookConfig.timeZone,
    region: facebookConfig.region,
  },
  syncFacebook
);


export {scheduleFacebookSync};

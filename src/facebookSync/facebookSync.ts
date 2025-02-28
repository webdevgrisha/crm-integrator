import {
  getDateFrom,
  getDateTo,
  updateDateFrom,
} from "../utils/dateFuncs";
import {onSchedule} from "firebase-functions/v2/scheduler";
import {handleFacebookLeads} from "./handleFacebookLeads";
import {handleSyncErrorState} from "../utils/handleSyncError";
import {facebookConfig} from "../projectConfig";
import {processLeads} from "../pipedrive/processLeads";
import {ServiceNames} from "../enums";
import {FacebookProcessData} from "./interfaces";

async function syncFacebook(): Promise<void> {
  const serviceName: ServiceNames = facebookConfig.serviceName;

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

    const facebookLeadsArr: FacebookProcessData[] = await handleFacebookLeads(
      dateFromEpochTime - 1,
      dateToEpochTime + 1
    );

    console.log(`[${serviceName}] Fetched ${facebookLeadsArr.length} records`);

    await processLeads(
      serviceName,
      dateFromTimestamp,
      facebookLeadsArr,
    );

    await updateDateFrom(dateToTimestamp, serviceName);

    await handleSyncErrorState(serviceName, false);

    console.log(`[${serviceName}] Sync completed successfully`);
  } catch (err) {
    await handleSyncErrorState(serviceName, true);

    throw new Error(`Sync ${serviceName} failed`);
  }
}

const scheduleFacebookSync = onSchedule(
  {
    schedule: facebookConfig.cron.schedule,
    timeZone: facebookConfig.cron.timeZone,
    region: facebookConfig.cron.region,
  },
  syncFacebook
);


export {scheduleFacebookSync};

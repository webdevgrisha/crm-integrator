import {
  getDateFrom,
  getDateTo,
  updateDateFrom,
} from "../utils/dateFuncs";
import {onSchedule} from "firebase-functions/v2/scheduler";
import {handleCallback24Data} from "./handleCallback24Data";
import {handleSyncErrorState} from "../utils/handleSyncError";
import {callback24Config} from "../projectConfig";
import {processLeads} from "../pipedrive/processLeads";
import logger from "../utils/logger";
import {ServiceNames} from "../enums";

async function syncCallback24(): Promise<void> {
  const serviceName: ServiceNames = callback24Config.serviceName;

  logger.info(`[${serviceName}] Sync started`);

  try {
    const {
      dateFromTimestamp,
      dateFromIsoDate,
    } = await getDateFrom(serviceName);
    const {dateToTimestamp, dateToIsoFormat} = getDateTo();

    logger.info(
      // eslint-disable-next-line max-len
      `[${serviceName}] Fetching data from ${dateFromIsoDate} to ${dateToIsoFormat}`
    );

    const callback24DataArr = await handleCallback24Data(
      dateFromIsoDate,
      dateToIsoFormat
    );

    logger.info(`[${serviceName}] Fetched ${callback24DataArr.length} records`);

    await processLeads(
      serviceName,
      dateFromTimestamp,
      callback24DataArr,
    );

    await updateDateFrom(dateToTimestamp, serviceName);

    await handleSyncErrorState(serviceName, false);

    logger.info(`[${serviceName}] Sync completed successfully`);
  } catch (error) {
    await handleSyncErrorState(serviceName, true);

    throw new Error(`Sync ${serviceName} failed: ${error}`);
  }
}

const scheduleCallback24Sync = onSchedule(
  {
    schedule: callback24Config.cron.schedule,
    timeZone: callback24Config.cron.timeZone,
    region: callback24Config.cron.region,
  },
  syncCallback24
);


export {scheduleCallback24Sync};

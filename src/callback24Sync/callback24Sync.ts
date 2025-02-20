import {
  getDateFrom,
  getDateTo,
  updateDateFrom,
} from "../utils/dateFuncs";
import {onSchedule} from "firebase-functions/v2/scheduler";
import {handleCallback24Data} from "./handleCallback24Data";
import {handleSyncErrorState} from "../utils/handleSyncError";
import {ProcessedLeadInfo} from "../interfaces";
import {saveProcessedLeadInfo} from "../utils/saveLeadInfo";
import {callback24Config} from "../projectConfig";
import {processLeads} from "../pipedrive/processLeads";


async function syncCallback24() {
  const serviceName = callback24Config.serviceName;
  const processedLeadsInfo: ProcessedLeadInfo[] = [];

  console.log(`[${serviceName}] Sync started`);

  // более того, весь блок try, catch одинаков в каджой функции, за исключением
  // такого типа функций handleCallback24Data
  // стоит ли вынести весь блок в одельную функцию ?
  // вроде бы переиспользование, но с другой стороны не вредит ли это читаемости
  try {
    const {
      dateFromTimestamp,
      dateFromIsoDate,
    } = await getDateFrom(serviceName);
    const {dateToTimestamp, dateToIsoFormat} = getDateTo();

    console.log(
      // eslint-disable-next-line max-len
      `[${serviceName}] Fetching data from ${dateFromIsoDate} to ${dateToIsoFormat}`
    );

    const callback24DataArr = await handleCallback24Data(
      dateFromIsoDate,
      dateToIsoFormat
    );

    console.log(`[${serviceName}] Fetched ${callback24DataArr.length} records`);

    // если четрые функции внизу повторяеться в каждой функции,
    //  стоит ли ее вынести в отдельную функцию
    await processLeads(serviceName, dateFromTimestamp, callback24DataArr);

    await updateDateFrom(dateToTimestamp, serviceName);

    await saveProcessedLeadInfo(processedLeadsInfo, serviceName);

    await handleSyncErrorState(serviceName, false);

    console.log(`[${serviceName}] Sync completed successfully`);
  } catch (error) {
    await handleSyncErrorState(serviceName, true);

    await saveProcessedLeadInfo(processedLeadsInfo, serviceName);

    throw new Error(`Sync ${serviceName} failed`);
  }
}

const scheduleCallback24Sync = onSchedule(
  {
    schedule: callback24Config.schedule,
    timeZone: callback24Config.timeZone,
    region: callback24Config.region,
  },
  syncCallback24
);


export {scheduleCallback24Sync};

import {
  getDateFrom,
  getDateTo,
  updateDateFrom,
} from "../utils/dateFuncs";
import {createPerson} from "../pipedrive/createPerson";
import {createLead} from "../pipedrive/createLeads";
import {onSchedule} from "firebase-functions/v2/scheduler";
import {handleCallback24Data} from "./handleCallback24Data";
import {delay} from "../utils/delay";
import {processSyncError, resetSyncErrorState} from "../utils/handleSyncError";
import {ProcessedLeadInfo} from "../interfaces";
import {filterSavedLeads} from "../utils/filterSavedLeads";
import {saveProcessedLeadInfo} from "../utils/saveLeadInfo";
import {callback24Config} from "../projectConfig";


async function syncCallback24() {
  const serviceName = callback24Config.serviceName;
  const processedLeadsInfo: ProcessedLeadInfo[] = [];

  console.log(`[${serviceName}] Sync started`);

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

    const savedLeads = await filterSavedLeads(serviceName, dateFromTimestamp);

    for (const data of callback24DataArr) {
      const {
        id,
        phoneNumber,
        hasRealised,
        callAtData,
        callAtTime,
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

      if (savedLeads[id].createdPersonId) {
        personId = savedLeads?.[id].createdPersonId as number;

        console.log(
          `[${serviceName}] Found existing person with ID: ${personId}`
        );
      } else {
        personId = await createPerson(
          phoneNumber,
          null,
          undefined,
          callAtData,
          callAtTime,
          hasRealised
        );
      }

      processedLeadInfo.createdPersonId = personId;
      await delay(200);

      const leadTitle = `${phoneNumber} - ${serviceName}`;

      const leadId = await createLead(
        leadTitle,
        personId,
        serviceName,
        utmSource,
        utmCampaign
      );

      processedLeadInfo.createdLeadId = leadId;
      await delay(200);
    }

    await updateDateFrom(dateToTimestamp, serviceName);

    await saveProcessedLeadInfo(processedLeadsInfo, serviceName);

    await resetSyncErrorState(serviceName);

    console.log(`[${serviceName}] Sync completed successfully`);
  } catch (error) {
    await processSyncError(serviceName);

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

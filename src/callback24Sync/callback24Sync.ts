import {
  getDateFormats,
  getISO8601DateFrom,
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


async function syncCallback24() {
  const serviceName = "callback24";
  const processedLeadsInfo: ProcessedLeadInfo[] = [];

  try {
    const {
      isoDate: dateFrom,
      timestamp: dateFromTimestamp,
    } = await getISO8601DateFrom(serviceName);
    const {currentTimestamp, dateToIsoFormat} = getDateFormats();

    const callback24DataArr = await handleCallback24Data(
      dateFrom,
      dateToIsoFormat
    );

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

    await updateDateFrom(currentTimestamp, serviceName);

    await saveProcessedLeadInfo(processedLeadsInfo, serviceName);

    await resetSyncErrorState(serviceName);
  } catch (error) {
    await processSyncError(serviceName);

    await saveProcessedLeadInfo(processedLeadsInfo, serviceName);

    throw new Error(`Sync ${serviceName} failed`);
  }
}

const scheduleCallback24Sync = onSchedule(
  {
    schedule: "0 * * * *",
    timeZone: "Europe/Warsaw",
    region: "europe-central2",
  },
  syncCallback24
);


export {scheduleCallback24Sync};

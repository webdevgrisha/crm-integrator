import {
  getDateFrom,
  getDateTo,
  updateDateFrom,
} from "../utils/dateFuncs";
import {createPerson} from "../pipedrive/createPerson";
import {createLead} from "../pipedrive/createLeads";
import {onSchedule} from "firebase-functions/v2/scheduler";
import {delay} from "../utils/delay";
import {handleFacebookLeads} from "./handleFacebookLeads";
import {processSyncError, resetSyncErrorState} from "../utils/handleSyncError";
import {ProcessedLeadInfo} from "../interfaces";
import {filterSavedLeads} from "../utils/filterSavedLeads";
import {saveProcessedLeadInfo} from "../utils/saveLeadInfo";
import { facebookConfig } from "../projectConfig";

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

    const savedLeads = await filterSavedLeads(serviceName, dateFromTimestamp);

    for (const data of facebookLeadsArr) {
      const {
        id,
        name,
        phone,
        email,
        carName,
        callTime,
        adName,
        campaignName,
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

        console.log(
          `[${serviceName}] Found existing person with ID: ${personId}`
        );
      } else {
        personId = await createPerson(
          phone,
          email,
          name
        );
      }

      processedLeadInfo.createdPersonId = personId;
      await delay(200);

      const leadTitle = `${phone} - ${serviceName}`;

      const leadId = await createLead(
        leadTitle,
        personId,
        serviceName,
        adName,
        campaignName,
        null,
        carName,
        `Kontakt ${callTime}`
      );

      processedLeadInfo.createdLeadId = leadId;
      await delay(200);
    }

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

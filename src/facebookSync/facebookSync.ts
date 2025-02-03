import {
  getDateFormats,
  getEpochTimeDateFrom,
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

async function syncFacebook() {
  const serviceName = "facebook";
  const processedLeadsInfo: ProcessedLeadInfo[] = [];

  try {
    const {
      epochTime: dateFrom,
      timestamp: dateFromTimestamp,
    } = await getEpochTimeDateFrom(serviceName);
    const {currentTimestamp, dateToEpochTime} = getDateFormats();

    const facebookLeadsArr = await handleFacebookLeads(
      dateFrom - 1,
      dateToEpochTime + 1
    );

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

    await updateDateFrom(currentTimestamp, serviceName);

    await saveProcessedLeadInfo(processedLeadsInfo, serviceName);

    await resetSyncErrorState(serviceName);
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
    schedule: "10 * * * *",
    timeZone: "Europe/Warsaw",
    region: "europe-central2",
  },
  syncFacebook
);


export {scheduleFacebookSync};

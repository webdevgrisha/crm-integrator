import {Timestamp} from "firebase-admin/firestore";
import {filterSavedLeads} from "../utils/filterSavedLeads";
import {ProcessedLeadInfo} from "../interfaces";
import {LeadObj, ServiceData} from "./interfaces";
import {parseServiceData} from "./parseServiceData";
import {delay} from "../utils/delay";
import {ServiceNames} from "../enums";
import {saveProcessedLeadInfo} from "../utils/saveLeadInfo";
import {processCreatePerson} from "./processCreatePerson";
import {processCreateLead} from "./processCreateLead";

interface ProcessLeads {
  serviceName: ServiceNames,
  dateFromSaveTimestamp: Timestamp,
  serviceDataArr: ServiceData[],
}


async function processLeads(data: ProcessLeads): Promise<void> {
  const {
    serviceName,
    dateFromSaveTimestamp,
    serviceDataArr,
  } = data;
  const processedLeadsInfoArr: ProcessedLeadInfo[] = [];

  try {
    const serviceLeadIds = serviceDataArr.map((serviceData) => serviceData.id);
    const savedLeads = await filterSavedLeads(
      {
        serviceName,
        serviceLeadIds,
      }
    );

    console.log(`[${serviceName}] filterSavedLeads: ${savedLeads}`);

    for (const data of serviceDataArr) {
      const {id, ...parsedData} = parseServiceData(data);

      const personObj = {
        phone: parsedData.phone,
        email: parsedData.email,
        personName: parsedData.personName,
        callData: parsedData.callData,
        callTime: parsedData.callTime,
        callRealize: parsedData.callRealize,
      };

      const leadObj: LeadObj = {
        utmSource: parsedData.utmSource,
        utmCampaign: parsedData.utmCampaign,
        utmTerm: parsedData.utmTerm,
        budget: parsedData.budget,
        carName: parsedData.carName,
        carDescription: parsedData.carDescription,
      };

      console.log(`[${serviceName}] Processing lead with ID: ${id}`);

      const processedLeadInfo: ProcessedLeadInfo = {
        serviceLeadId: id,
        createdPersonId: null,
        createdLeadId: null,
        dateFrom: dateFromSaveTimestamp,
      };

      processedLeadsInfoArr.push(processedLeadInfo);

      const personId: number = await processCreatePerson(
        {
          id,
          serviceName,
          savedLeads,
          personObj,
        }
      );

      processedLeadInfo.createdPersonId = personId;
      await delay(500);

      const leadId = await processCreateLead(
        {
          id,
          phone: parsedData.phone,
          serviceName,
          personId,
          savedLeads,
          leadObj,
        }
      );

      processedLeadInfo.createdLeadId = leadId;
      await delay(500);
    }

    await saveProcessedLeadInfo(processedLeadsInfoArr, serviceName);
  } catch (error) {
    await saveProcessedLeadInfo(processedLeadsInfoArr, serviceName);

    throw new Error("Error");
  }
}

export {
  processLeads,
};

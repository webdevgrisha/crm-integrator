import { Timestamp } from "firebase/firestore";
import { filterSavedLeads, SavedLeads } from "../utils/filterSavedLeads";
import { ProcessedLeadInfo } from "../interfaces";
import { createPerson, CreatePersonFields } from "./createPerson";
import { createLead } from "./createLeads";
import { ServiceData } from "./interfaces";
import { parseServiceData } from "./parseServiceData";
import { delay } from "../utils/delay";
import { ChannelNames } from "../types";


async function processLeads(
    serviceName: ChannelNames,
    dateFromTimestamp: Timestamp,
    serviceDataArr: ServiceData[]
) {
    const processedLeadsInfoArr: ProcessedLeadInfo[] = [];

    const savedLeads = await filterSavedLeads(serviceName, dateFromTimestamp);

    for (const data of serviceDataArr) {
        const { id, ...parsedData } = parseServiceData(data);

        const personObj = {
            phone: parsedData.phone,
            email: parsedData.email,
            personName: parsedData.personName,
            callData: parsedData.callData,
            callTime: parsedData.callTime,
            callRealise: parsedData.callRealise
        }

        const leadObj: LeadObj = {
            utmSource: parsedData.utmSource,
            utmCampaign: parsedData.utmCampaign,
            budget: parsedData.budget,
            carName: parsedData.carName,
            carDescription: parsedData.carDescription,
        }

        console.log(`[${serviceName}] Processing lead with ID: ${id}`);

        const processedLeadInfo: ProcessedLeadInfo = {
            serviceLeadId: id,
            createdPersonId: null,
            createdLeadId: null,
            dateFrom: dateFromTimestamp,
        };

        processedLeadsInfoArr.push(processedLeadInfo);

        const personId: number = await processCreatePerson(
            id,
            serviceName,
            savedLeads,
            personObj
        );

        processedLeadInfo.createdPersonId = personId;
        await delay(200);

        const leadId = await processCreateLead(
            parsedData.phone,
            serviceName,
            personId,
            leadObj
        )

        processedLeadInfo.createdLeadId = leadId;
        await delay(200);
    }

    return processedLeadsInfoArr;
}

async function processCreatePerson(
    id: string | number,
    serviceName: ChannelNames,
    savedLeads: SavedLeads,
    personObj: CreatePersonFields
) {
    let personId: number;

    if (savedLeads[id].createdPersonId) {
        personId = savedLeads?.[id].createdPersonId as number;

        console.log(
            `[${serviceName}] Found existing person with ID: ${personId}`
        );
    } else {
        personId = await createPerson(personObj);
    }

    return personId;
}

interface LeadObj {
    utmSource?: string | null;
    utmCampaign?: string | null;
    budget?: string | null;
    carName?: string | null;
    carDescription?: string | null;
}

async function processCreateLead(
    phone: string,
    serviceName: ChannelNames,
    personId: number,
    leadObj: LeadObj
) {
    const leadTitle = `${phone} - ${serviceName}`;

    const leadId = await createLead(
        {
            title: leadTitle,
            channelName: serviceName,
            personId,
            ...leadObj
        }
    );

    return leadId;
}


export {
    processLeads,
};

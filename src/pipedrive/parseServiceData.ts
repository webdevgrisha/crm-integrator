import {ServiceData} from "./interfaces";

function parseServiceData(serviceData: ServiceData) {
  console.log("Starting to parse service data:");

  const id: string | number = serviceData.id;

  // person
  const phone: string = serviceData.phone;
  const email: string | undefined =
    "email" in serviceData ? serviceData.email : undefined;
  const personName: string | undefined =
    "name" in serviceData ? serviceData.name : undefined;
  const callData: string | undefined =
    "callAtData" in serviceData ? serviceData.callAtData : undefined;
  const callTime: string | undefined =
    "callAtTime" in serviceData ? serviceData.callAtTime : undefined;
  const callRealise: "Tak" | "Nie" | undefined =
    "hasRealised" in serviceData ? serviceData.hasRealised : undefined;

  // lead
  const utmSource: string | null | undefined =
    "utmSource" in serviceData ? serviceData.utmSource : serviceData.adName;
  const utmCampaign: string | undefined | null =
    "campaignName" in serviceData ? serviceData.campaignName :
      serviceData.utmCampaign;
  const budget: string | undefined =
    "budget" in serviceData ? serviceData.budget : undefined;
  const carName: string | undefined =
    "carName" in serviceData ? serviceData.carName : undefined;
  const carDescription: string | undefined =
    "description" in serviceData ? serviceData.description : undefined;


  const parseData = {
    id,
    phone,
    email,
    personName,
    callData,
    callTime,
    callRealise,
    utmSource,
    utmCampaign,
    budget,
    carName,
    carDescription,
  };

  console.log(`Data parsed successfully for data with id: ${id}`);

  return parseData;
}


export {
  parseServiceData,
};

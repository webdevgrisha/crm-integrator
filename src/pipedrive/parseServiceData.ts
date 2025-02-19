import { ServiceData } from "./interfaces";

function parseServiceData(serviceData: ServiceData) {
  const id: string | number = serviceData.id;

  // person
  const phone: string = serviceData.phone;
  const email: string | undefined = serviceData.email;
  const personName: string | undefined = serviceData.name;
  const callData: string | undefined = serviceData.callAtData;
  const callTime: string | undefined = serviceData.callAtTime;
  const callRealise: 'Tak' | 'Nie' | undefined = 
    serviceData.hasRealised;

  // lead
  const utmSource: string | null | undefined =
        serviceData.utmSource || serviceData.adName;
  const utmCampaign: string | undefined =
        serviceData.utmCampaign || serviceData.campaignName;
  const budget: string | undefined = serviceData.budget;
  const carName: string | undefined = serviceData.carName || serviceData.car;
  const carDescription: string | undefined = serviceData.description;

  
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

  return parseData;
}


export {
    parseServiceData
}
import {Callback24ProcessData} from "../callback24Sync/interfaces";
import {FacebookProcessData} from "../facebookSync/interfaces";
import {ProcessedMail} from "../gmailSync/interfaces";


type ServiceData = Callback24ProcessData | ProcessedMail | FacebookProcessData;

interface LeadObj {
  utmSource?: string | null;
  utmCampaign?: string | null;
  utmTerm?: string | null;
  budget?: string | null;
  carName?: string | null;
  carDescription?: string | null;
}


export type {
  ServiceData,
  LeadObj,
};

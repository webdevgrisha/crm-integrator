import {Callback24ProcessData} from "../callback24Sync/interfaces";
import {FacebookProcessData} from "../facebookSync/interfaces";
import {ProcessedMail} from "../gmailSync/interfaces";


type ServiceData = Callback24ProcessData | ProcessedMail | FacebookProcessData;


export type {
  ServiceData,
};

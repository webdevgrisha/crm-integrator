import {ServiceNames} from "../../enums";
import {Currency, VisibilityGroup} from "./enums";


// create persons API Docs
// https://developers.pipedrive.com/docs/api/v1/Persons
interface PersonConfig {
  visible_to: VisibilityGroup,
  callStatusOptions: {
    yes: number,
    no: number,
  },
}

const personConfig: PersonConfig = {
  visible_to: VisibilityGroup.EntireCompany,
  callStatusOptions: {
    yes: 42,
    no: 43,
  },
};


// create lead API Docs
// https://developers.pipedrive.com/docs/api/v1/Leads
type ChannelsId = {
  [K in ServiceNames]: number;
}

interface LeadConfig {
  channelsId: ChannelsId,
  currency: Currency,
  visibleTo: VisibilityGroup,
}


const channelsId: ChannelsId = {
  callback24: 34,
  gmail: 35,
  facebook: 36,
};

const leadConfig: LeadConfig = {
  channelsId: channelsId,
  currency: Currency.PLN,
  visibleTo: VisibilityGroup.OwnerAndFollowers,
};


interface PipedriveConfig {
    apiKeyName: string;
    personConfig: PersonConfig;
    leadConfig: LeadConfig;
}

const pipedriveConfig: PipedriveConfig = {
  apiKeyName: "pipedrive-api",
  leadConfig,
  personConfig,
};

export {
  pipedriveConfig,
  LeadConfig,
  PersonConfig,
};

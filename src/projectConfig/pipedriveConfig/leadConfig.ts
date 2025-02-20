// create lead API Docs
// https://developers.pipedrive.com/docs/api/v1/Leads

import {CustomFields, VisibilityGroup} from "./types";

type ChannelNames = "callback24" | "gmail" | "facebook";
type ChannelIds = Record<ChannelNames, number>;
type Currency = "PLN" | "EUR" | "USD";

interface LeadConfig {
    channelIds: ChannelIds;
    currency: Currency,
    visibleTo: VisibilityGroup,
    customFields: CustomFields,
}

const channelIds: ChannelIds = {
  callback24: 34,
  gmail: 35,
  facebook: 36,
};

const leadCustomFields: CustomFields = {
  leadCarField: 41,
  leadCarDescriptionField: 43,
  utmCampaignField: 40,
};

const leadConfig: LeadConfig = {
  channelIds,
  currency: "PLN",
  visibleTo: "1",
  customFields: leadCustomFields,
};


export {
  leadConfig,
};

export type {
  LeadConfig,
};

import {ServiceNames} from "../enums";

const formFields = [
  "created_time",
  "ad_name",
  "campaign_name",
  "field_data",
];

interface FacebookConfig {
  serviceName: ServiceNames;
  apiKeyName: string;
  formFields: string[];
  cron: {
    schedule: string;
    timeZone: string;
    region: string;
  }
}

const facebookConfig: FacebookConfig = {
  serviceName: ServiceNames.Facebook,
  apiKeyName: "facebook-api",
  formFields: formFields,
  cron: {
    schedule: "10 * * * *",
    timeZone: "Europe/Warsaw",
    region: "europe-central2",
  },
};

export {
  facebookConfig,
};

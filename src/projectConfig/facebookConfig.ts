import { ChannelNames } from "../types"

const formFields = [
    "created_time",
    "ad_name",
    "campaign_name",
    "field_data",
];

interface FacebookConfig {
    serviceName: ChannelNames;
    apiKeyName: string;
    formFields: string[];
    schedule: string;
    timeZone: string;
    region: string;
}

const facebookConfig: FacebookConfig = {
    serviceName: "facebook",
    apiKeyName: "facebook-api",
    formFields: formFields,
    schedule: "10 * * * *",
    timeZone: "Europe/Warsaw",
    region: "europe-central2",
}

export {
    facebookConfig
}
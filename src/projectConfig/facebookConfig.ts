import {ServiceNames} from "../enums";

const formFields = [
  "created_time",
  "ad_name",
  "campaign_name",
  "field_data",
];

const leadgenFormsParams: Record<string, unknown> = {
  fields: "id,name,status",
  limit: 100,
};

const leadgenFormsEdge = "leadgen_forms";

type FacebookLeadInfoKey =
  "name" |
  "phone" |
  "email" |
  "callTime" |
  "carName" |
  "budget" |
  "utmTerm";

type FieldDataNameTranslation = {
  [key in LeadDataNames]: FacebookLeadInfoKey;
}

enum LeadDataNames {
  ContactHours = "w_jakich_godzinach_można_się_kontaktować_?_",
  PhoneNumber = "numer_telefonu",
  PhoneNumberV2 = "phone_number",
  PersonName = "imię",
  PersonNameV2 = "full_name",
  Email = "email",
  CarName = "jakiego_samochodu_szukasz_?",
  Budget = "jaki_jest_twój_budżet?",
  PurchasePlan = "kiedy_planujesz_zakup_nowego_auta?",
}

const fieldDataNameTranslation: FieldDataNameTranslation = {
  [LeadDataNames.ContactHours]: "callTime",
  [LeadDataNames.PhoneNumber]: "phone",
  [LeadDataNames.PhoneNumberV2]: "phone",
  [LeadDataNames.PersonName]: "name",
  [LeadDataNames.PersonNameV2]: "name",
  [LeadDataNames.Email]: "email",
  [LeadDataNames.CarName]: "carName",
  [LeadDataNames.Budget]: "budget",
  [LeadDataNames.PurchasePlan]: "utmTerm",
};


interface FacebookConfig {
  serviceName: ServiceNames;
  apiKeyName: string;
  formFields: string[];
  leadgenFormsParams: Record<string, unknown>;
  leadgenFormsEdge: string;
  fieldDataNameTranslation: FieldDataNameTranslation;
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
  leadgenFormsParams,
  leadgenFormsEdge,
  fieldDataNameTranslation,
  cron: {
    schedule: "10 * * * *",
    timeZone: "Europe/Warsaw",
    region: "europe-central2",
  },
};

export {
  facebookConfig,
  LeadDataNames,
};

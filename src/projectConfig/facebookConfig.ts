import {ServiceNames} from "../enums";

const formFields = [
  "created_time",
  "ad_name",
  "campaign_name",
  "field_data",
];

type FieldDataNameTranslation = {
  [key in LeadDataNames]: string;
}

enum LeadDataNames {
  ContactHours = "w_jakich_godzinach_można_się_kontaktować_?_",
  PhoneNumber = "numer_telefonu",
  PersonName = "imię",
  Email = "email",
  CarName = "jakiego_samochodu_szukasz_?",
}

const fieldDataNameTranslation: FieldDataNameTranslation = {
  [LeadDataNames.ContactHours]: "callTime",
  [LeadDataNames.PhoneNumber]: "phone",
  [LeadDataNames.PersonName]: "name",
  [LeadDataNames.Email]: "email",
  [LeadDataNames.CarName]: "carName",
};


interface FacebookConfig {
  serviceName: ServiceNames;
  apiKeyName: string;
  formFields: string[];
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

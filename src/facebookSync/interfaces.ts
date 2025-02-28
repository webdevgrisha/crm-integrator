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

interface LeadFiledData {
    name: LeadDataNames;
    values: string[];
}

interface FacebookLeadData {
    id: string;
    created_time: string;
    campaign_name: string;
    ad_name: string;
    field_data: LeadFiledData[];
}

interface FacebookLeadInfo {
    name: string;
    phone: string;
    email: string;
    callTime: string;
    carName: string;
}

interface FacebookProcessData extends FacebookLeadInfo {
    id: string;
    adName: string;
    campaignName: string;
}

export type {
  FacebookLeadData,
  FacebookLeadInfo,
  FieldDataNameTranslation,
  FacebookProcessData,
};

export {
  LeadDataNames,
};

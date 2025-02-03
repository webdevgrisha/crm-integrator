type LeadDataNames = "w_jakich_godzinach_można_się_kontaktować_?_"
    | "numer_telefonu"
    | "imię"
    | "email"
    | "jakiego_samochodu_szukasz_?";

interface LeadFiledData {
    name: LeadDataNames;
    values: string[];
}

interface LeadData {
    id: string;
    created_time: string;
    campaign_name: string;
    ad_name: string;
    field_data: LeadFiledData[]
}

interface LeadInfo {
    name: string;
    phone: string;
    email: string;
    callTime: string;
    carName: string;
}

interface FieldDataNameTranslation {
    [key: string]: keyof LeadInfo;
}

export type {
  LeadData,
  LeadInfo,
  FieldDataNameTranslation,
};

import {FieldDataNameTranslation, LeadData, LeadInfo} from "./interfaces";

// стоит ли добавить обработку ошибок?
function reformatFacebookLeads(leads: any[]) {
  // стоит ли вынести в конфиг ?
  const fieldDataNameTranslation: FieldDataNameTranslation = {
    "w_jakich_godzinach_można_się_kontaktować_?_": "callTime",
    "numer_telefonu": "phone",
    "imię": "name",
    "email": "email",
    "jakiego_samochodu_szukasz_?": "carName",
  };

  const reformatLeads = leads.map((lead: LeadData) => {
    const leadInfo: LeadInfo = {
      name: "",
      phone: "",
      email: "",
      callTime: "",
      carName: "",
    };

    lead.field_data.forEach((field) => {
      const leadInfoKey = fieldDataNameTranslation[field.name];
      leadInfo[leadInfoKey] = field.values[0];
    });

    return {
      id: lead.id,
      adName: lead.ad_name,
      campaignName: lead.campaign_name,
      ...leadInfo,
    };
  });

  return reformatLeads;
}

export {reformatFacebookLeads};

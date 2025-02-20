import {
  FieldDataNameTranslation,
  LeadData,
  LeadDataNames,
  LeadInfo,
} from "./interfaces";

// стоит ли добавить обработку ошибок?
function reformatFacebookLeads(leads: any[]) {
  // стоит ли вынести в конфиг ?
  const fieldDataNameTranslation: FieldDataNameTranslation = {
    [LeadDataNames.ContactHours]: "callTime",
    [LeadDataNames.PhoneNumber]: "phone",
    [LeadDataNames.PersonName]: "name",
    [LeadDataNames.Email]: "email",
    [LeadDataNames.CarName]: "carName",
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
      const leadInfoKey =
        fieldDataNameTranslation[field.name] as keyof LeadInfo;
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

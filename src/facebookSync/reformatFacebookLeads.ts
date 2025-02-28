import {
  FacebookProcessData,
  FieldDataNameTranslation,
  FacebookLeadData,
  LeadDataNames,
  FacebookLeadInfo,
} from "./interfaces";

function reformatFacebookLeads(
  leads: FacebookLeadData[]
): FacebookProcessData[] {
  // ссылка в докмеетации
  const fieldDataNameTranslation: FieldDataNameTranslation = {
    [LeadDataNames.ContactHours]: "callTime",
    [LeadDataNames.PhoneNumber]: "phone",
    [LeadDataNames.PersonName]: "name",
    [LeadDataNames.Email]: "email",
    [LeadDataNames.CarName]: "carName",
  };

  try {
    const reformatLeads: FacebookProcessData[] = leads.map(
      (lead: FacebookLeadData) => {
        const leadInfo: FacebookLeadInfo = {
          name: "",
          phone: "",
          email: "",
          callTime: "",
          carName: "",
        };

        lead.field_data.forEach((field) => {
          const leadInfoKey =
            fieldDataNameTranslation[field.name] as keyof FacebookLeadInfo;
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
  } catch (error) {
    console.error("Error reformatting Facebook leads:", error);

    throw new Error(`Error reformatting Facebook leads: ${error}`);
  }
}

export {reformatFacebookLeads};

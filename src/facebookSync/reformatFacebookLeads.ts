import {facebookConfig} from "../projectConfig";
import {
  FacebookProcessData,
  FacebookLeadData,
  FacebookLeadInfo,
} from "./interfaces";

function reformatFacebookLeads(
  leads: FacebookLeadData[]
): FacebookProcessData[] {
  // ссылка в докмеетации

  try {
    const reformatLeads: FacebookProcessData[] = leads.map(
      (lead: FacebookLeadData) => {
        const leadInfo: FacebookLeadInfo = {
          name: "",
          phone: "",
          email: "",
          callTime: "",
          carName: "",
          budget: "",
          utmTerm: "",
        };

        lead.field_data.forEach((field) => {
          const leadInfoKey =
            facebookConfig.fieldDataNameTranslation[field.name];

          if (!leadInfoKey) {
            console.log(
              `[facebook] Unknown lead field "${field.name}" ` +
              `for lead ${lead.id}`
            );
            return;
          }

          leadInfo[leadInfoKey] = field.values[0];
        });

        const SUFFIX = "...";
        const MAX_LENGTH = 255;

        if (leadInfo.carName.length > MAX_LENGTH) {
          leadInfo.description =
            `Pełny opis z pola Samochód:\n${leadInfo.carName}`;

          leadInfo.carName =
            leadInfo.carName.slice(0, MAX_LENGTH - SUFFIX.length) + SUFFIX;
        }

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

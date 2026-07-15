import {MailFields} from "./interfaces";


function extractGmailFields(
  messageBody: string,
  header: string
): MailFields {
  const fields: MailFields = {
    email: "",
    phone: "",
    utmSource: "",
    utmCampaign: undefined,
    utmTerm: undefined,
    carName: undefined,
    budget: undefined,
    description: undefined,
  };

  const emailRegex = /E-mail:\s*([\w.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/;
  const phoneRegex = /Numer telefonu:\s*([\d\s+-]+)/;
  const carRegex = /Auto:\s*([^\r\n]+)/;
  const budgetRegex = /Budżet:\s*([\d]+)/;
  const carLinkRegex =
    /Link do samochodu:\s*(https:\/\/libertycar\.pl\/[^\s]*)/;
  const descriptionRegex = /Treść wiadomości:\s*([\s\S]*?)\nUTM Source:/;
  const utmSourceRegex = /UTM Source:\s*([^\r\n]+)(?=\s*UTM Medium:|$)/;
  const utmCampaignRegex = /UTM Campaign:\s*([^\r\n]+)(?=\s*UTM Term:|$)/;
  const utmTermRegex = /UTM Term:\s*([^\r\n]*)/;

  try {
    if (header === "Lead sprowadzenie auta libertycar.pl") {
      fields.carName = (messageBody.match(carRegex) || [])[1];
      fields.budget = (messageBody.match(budgetRegex) || [])[1];

      const SUFFIX = "...";
      const MAX_LENGTH = 255;

      if (fields.carName.length > MAX_LENGTH) {
        fields.description = `Pełny opis z pola Samochód:\n${fields.carName}`;

        fields.carName =
          fields.carName.slice(0, MAX_LENGTH - SUFFIX.length) + SUFFIX;
      }
    } else if (header === "Lead polecana oferta libertycar.pl") {
      fields.description = (messageBody.match(carLinkRegex) || [])[1];
    } else {
      fields.description =
        (messageBody.match(descriptionRegex) || [])[1]?.trim();
    }

    fields.email = (messageBody.match(emailRegex) || [])[1] || "unknown";
    fields.phone =
      (messageBody.match(phoneRegex) || [])[1]?.replace(/[\r\n]+/g, "")
        .trim() || "unknown";

    fields.utmSource =
      (messageBody.match(utmSourceRegex) || [])[1]?.trim() || "DIRECT";
    fields.utmCampaign =
      (messageBody.match(utmCampaignRegex) || [])[1]?.trim();
    fields.utmTerm =
      (messageBody.match(utmTermRegex) || [])[1]?.trim();
  } catch (error) {
    console.error("Error while extracting Gmail fields:", error);

    throw new Error(
      "Error while extracting Gmail fields. Please check the input format."
    );
  }

  return fields;
}


export {extractGmailFields};

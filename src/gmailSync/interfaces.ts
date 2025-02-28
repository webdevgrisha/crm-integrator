interface MailFields {
  email: string;
  phone: string;
  utmSource: string;
  utmCampaign?: string | null;
  carName?: string;
  budget?: string;
  description?: string;
}

interface ProcessedMail extends MailFields {
  id: string;
}

export type {
  MailFields,
  ProcessedMail,
};

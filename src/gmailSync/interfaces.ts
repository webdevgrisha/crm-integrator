interface MailFields {
  email: string;
  phone: string;
  utmSource: string;
  utmCampaign: string | null;
  car?: string | null;
  budget?: string | null;
  description?: string | null;
}

interface ImapMessage {
  attributes: {
    date: string;
  };
  parts: Array<{
    which: string;
    body: string;
  }>;
  "x-gm-msgid": string;
}

export type {
  MailFields,
  ImapMessage,
};

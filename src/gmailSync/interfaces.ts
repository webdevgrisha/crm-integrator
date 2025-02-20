interface MailFields {
  email: string;
  phone: string;
  utmSource: string;
  utmCampaign?: string;
  car?: string;
  budget?: string;
  description?: string;
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

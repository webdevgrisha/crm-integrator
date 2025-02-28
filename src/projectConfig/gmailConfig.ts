import {ServiceNames} from "../enums";

interface GmailApiConfig {
  credentialsName: string;
  tokenName: string;
}

interface GmailImapConfig {
  secretName: string;
  imapServer: {
    connTimeout: number,
    authTimeout: number,
    keepalive: true,
  }
}

interface GmailConfig {
  serviceName: ServiceNames;
  filterMailTitles: string[];
  imapConfig: GmailImapConfig;
  gmailApiConfig: GmailApiConfig;
  cron: {
    schedule: string;
    timeZone: string;
    region: string;
  }
}

// Gmail API
const gmailApiConfig: GmailApiConfig = {
  credentialsName: "credentials",
  tokenName: "token",
};

// IMAP
const gmailImapConfig: GmailImapConfig = {
  secretName: "gmail-imap",
  imapServer: {
    connTimeout: 10000,
    authTimeout: 10000,
    keepalive: true,
  },
};

const gmailConfig: GmailConfig = {
  serviceName: ServiceNames.Gmail,
  filterMailTitles: [
    "Lead polecana oferta libertycar.pl",
    "Lead sprowadzenie auta libertycar.pl",
    "Kontakt libertycar.pl",
  ],
  imapConfig: gmailImapConfig,
  gmailApiConfig: gmailApiConfig,
  cron: {
    schedule: "5 * * * *",
    timeZone: "Europe/Warsaw",
    region: "europe-central2",
  },
};

export {
  gmailConfig,
  GmailImapConfig,
};

import {ChannelNames} from "../types";

interface GmailApiConfig {
    credentialsName: string;
    tokenName: string;
}

interface GmailImapConfig {
    secretName: string;
    connTimeout: number,
    authTimeout: number,
    keepalive: true,
}

interface GmailConfig {
    serviceName: ChannelNames;
    filterMailTitles: string[];
    imapSecretConfig: GmailImapConfig;
    gmailApiSecretConfig: GmailApiConfig;
    schedule: string;
    timeZone: string;
    region: string;
}

// Gmail API
const gmailApiConfig: GmailApiConfig = {
  credentialsName: "credentials",
  tokenName: "token",
};

// IMAP
const gmailImapConfig: GmailImapConfig = {
  secretName: "gmail-imap",
  connTimeout: 10000,
  authTimeout: 10000,
  keepalive: true,
};

const gmailConfig: GmailConfig = {
  serviceName: "gmail",
  filterMailTitles: [
    "Lead polecana oferta libertycar.pl",
    "Lead sprowadzenie auta libertycar.pl",
    "Kontakt libertycar.pl",
  ],
  imapSecretConfig: gmailImapConfig,
  gmailApiSecretConfig: gmailApiConfig,
  schedule: "5 * * * *",
  timeZone: "Europe/Warsaw",
  region: "europe-central2",
};

export {
  gmailConfig,
};

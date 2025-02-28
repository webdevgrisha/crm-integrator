import Imap from "imap-simple";

import {formatTimestampToDate} from "../../utils/dateFuncs";
import {getSecret} from "../../utils/getSecret";
import {createSearchCriteria, SearchCriteria} from "./createSearchCriteria";
import {gmailConfig} from "../../projectConfig";
import {GmailImapConfig} from "../../projectConfig/gmailConfig";

interface GmailInfo {
  user: string;
  password: string;
  host: string;
  port: number;
}

interface FetchOptions {
  bodies: string[];
  struct: boolean;
}

// обсдуть еще раз почему стоит выносить return из try, catch, finally
async function getGmailHistoryImap(
  dateFromEpochTime: number,
  dateToEpochTime: number
): Promise<Imap.Message[]> {
  let connection: Imap.ImapSimple | undefined;
  let filteredMessages: Imap.Message[];

  try {
    const imapConfig: GmailImapConfig = gmailConfig.imapConfig;
    const gmailInfo: GmailInfo = JSON.parse(
      await getSecret(imapConfig.secretName)
    );

    const config = {
      imap: {
        user: gmailInfo.user,
        password: gmailInfo.password,
        host: gmailInfo.host,
        port: gmailInfo.port,
        tls: true,
        tlsOptions: {
          servername: gmailInfo.host,
        },
        connTimeout: imapConfig.imapServer.connTimeout,
        authTimeout: imapConfig.imapServer.authTimeout,
        keepalive: imapConfig.imapServer.keepalive,
      },
    };

    console.log("Connecting to IMAP...");
    connection = await Imap.connect(config) as Imap.ImapSimple;

    await connection.openBox("INBOX");

    const formattedDate: string =
      formatTimestampToDate(dateFromEpochTime * 1000);

    const searchCriteria: SearchCriteria = createSearchCriteria(formattedDate);

    const fetchOptions: FetchOptions = {
      bodies: [""],
      struct: true,
    };

    const messages: Imap.Message[] = await connection.search(
      searchCriteria,
      fetchOptions
    );
    console.log("Emails found:", messages.length);

    filteredMessages = messages.filter((message: Imap.Message) => {
      const internalDate = Math.floor(
        new Date(message.attributes.date).getTime() / 1000
      );

      return internalDate > dateFromEpochTime && internalDate < dateToEpochTime;
    });
  } catch (err) {
    console.error("Error while fetching emails from IMAP:", err);

    throw new Error(`Failed to fetch emails from IMAP: ${err}`);
  } finally {
    await connection?.end();

    console.log("Connection closed.");
  }

  return filteredMessages;
}


export {getGmailHistoryImap};

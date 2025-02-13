import Imap from "imap-simple";

import {formatTimestampToDate} from "../../utils/dateFuncs";
import {getSecret} from "../../utils/getSecret";
import { createSearchCriteria } from "./createSearchCriteria";
import { gmailConfig } from "../../projectConfig";

async function getGmailHistoryImap(
  dateFromEpochTime: number,
  dateToEpochTime: number
) {
  let connection;
  let filteredMessages: Imap.Message[];
  try {
    const gmailInfo = JSON.parse(
      await getSecret(gmailConfig.imapSecretConfig.secretName)
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
        connTimeout: gmailConfig.imapSecretConfig.connTimeout,
        authTimeout: gmailConfig.imapSecretConfig.authTimeout,
        keepalive: gmailConfig.imapSecretConfig.keepalive,
      },
    };

    console.log("Connecting to IMAP...");
    connection = await Imap.connect(config);

    await connection.openBox("INBOX");

    const formattedDate = formatTimestampToDate(dateFromEpochTime * 1000);

    const searchCriteria = createSearchCriteria(formattedDate);

    const fetchOptions = {
      bodies: [""],
      struct: true,
    };

    const messages = await connection.search(
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

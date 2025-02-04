import Imap from "imap-simple";

import {formatTimestampToDate} from "../utils/dateFuncs";
import {getSecret} from "../utils/getSecret";

async function getGmailHistoryImap(
  dateFromEpochTime: number,
  dateToEpochTime: number
) {
  let connection;
  let filteredMessages: Imap.Message[];
  try {
    const gmailInfo = JSON.parse(await getSecret("gmail-imap"));

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
        connTimeout: 10000,
        authTimeout: 10000,
        keepalive: true,
      },
    };

    console.log("Connecting to IMAP...");
    connection = await Imap.connect(config);

    await connection.openBox("INBOX");

    const formattedDate = formatTimestampToDate(dateFromEpochTime * 1000);

    const searchCriteria = [
      "ALL",
      ["SINCE", formattedDate],
      [
        "OR",
        ["HEADER", "SUBJECT", "Lead polecana oferta libertycar.pl"],
        [
          "OR",
          ["HEADER", "SUBJECT", "Lead sprowadzenie auta libertycar.pl"],
          ["HEADER", "SUBJECT", "Kontakt libertycar.pl"],
        ],
      ],
    ];

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
    connection?.end();

    console.log("Connection closed.");
  }

  return filteredMessages;
}


export {getGmailHistoryImap};

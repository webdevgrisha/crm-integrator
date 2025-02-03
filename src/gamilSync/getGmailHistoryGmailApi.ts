/* eslint-disable @typescript-eslint/no-explicit-any, camelcase, max-len */
import { gmail_v1 } from "googleapis";


async function getGmailHistoryGmailApi(
  gmail: gmail_v1.Gmail,
  dateFrom: number,
  dateTo: number
) {
  const subjectQuery = `subject: "Lead polecana oferta libertycar.pl" 
    OR subject: "Lead sprowadzenie auta libertycar.pl" 
    OR subject: "Kontakt libertycar.pl"
    after:${dateFrom} before:${dateTo}`;

  try {
    const messagesList = await gmail.users.messages.list({
      userId: "me",
      labelIds: ["INBOX"],
      q: subjectQuery,
    });

    const messages: gmail_v1.Schema$Message[] = messagesList.data.messages || [];

    if (messages.length === 0) {
      console.log("No messages found.");
      return [];
    }

    return messages;
  } catch (error) {
    console.error("Error while fetching Gmail history:", error);

    throw new Error("Failed to fetch Gmail history. Please check the API request or network.");
  }
}


export {
  getGmailHistoryGmailApi,
};

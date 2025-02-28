/* eslint-disable camelcase */
import {gmail_v1} from "googleapis";
import {createFilterSearchQuery} from "./createFilterSearchQuery";

interface GetGmailHistoryApiObj {
  gmail: gmail_v1.Gmail,
  dateFrom: number,
  dateTo: number
}

async function getGmailHistoryGmailApi(
  gmailObj: GetGmailHistoryApiObj
): Promise<gmail_v1.Schema$Message[]> {
  const {gmail, dateFrom, dateTo} = gmailObj;

  const subjectQuery: string = createFilterSearchQuery(dateFrom, dateTo);

  try {
    const messagesList = await gmail.users.messages.list({
      userId: "me",
      labelIds: ["INBOX"],
      q: subjectQuery,
    });

    const messages: gmail_v1.Schema$Message[] =
      messagesList.data.messages || [];

    if (messages.length === 0) {
      console.log("No messages found.");
      return [];
    }

    return messages;
  } catch (error) {
    console.error("Error while fetching Gmail history:", error);

    throw new Error(
      "Failed to fetch Gmail history. Please check the API request or network."
    );
  }
}


export {
  getGmailHistoryGmailApi,
};

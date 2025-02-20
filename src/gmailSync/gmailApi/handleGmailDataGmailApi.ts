/* eslint-disable @typescript-eslint/no-explicit-any, camelcase */
import {gmail_v1} from "googleapis";
import {getGmailMessageBody} from "./getGmailMessageBody";
import {extractGmailFields} from "../extractGmailFields";
import {getGmailHistoryGmailApi} from "./getGmailHistoryGmailApi";


async function processMessageGmailApi(
  gmail: gmail_v1.Gmail,
  messageId: string
) {
  try {
    const messageDetails = await gmail.users.messages
      .get({userId: "me", id: messageId});

    const payload = messageDetails.data.payload;

    if (!payload) {
      throw new Error("No payload in message details");
    }

    const headers = payload.headers || [];
    const subjectHeader = headers.find((header) => header.name === "Subject");
    const header = subjectHeader?.value?.trim() || "";

    const body = getGmailMessageBody(payload);
    const extractedFields = extractGmailFields(body, header);

    return {id: messageId, ...extractedFields};
  } catch (error) {
    console.error("Error processing message:", error);

    throw new Error(`Failed to process message with ID ${messageId}`);
  }
}

async function handleGmailDataGmailApi(
  gmail: gmail_v1.Gmail,
  dateFrom: number,
  dateTo: number
) {
  const messages = await getGmailHistoryGmailApi(gmail, dateFrom, dateTo);

  const processData = await Promise.all(
    messages.map((message) => processMessageGmailApi(gmail, message.id!))
  );

  return processData;
}


export {handleGmailDataGmailApi};


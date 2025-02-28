/* eslint-disable camelcase */
import {gmail_v1} from "googleapis";
import {getGmailMessageBody} from "./getGmailMessageBody";
import {extractGmailFields} from "../extractGmailFields";
import {getGmailHistoryGmailApi} from "./getGmailHistoryGmailApi";
import {MailFields, ProcessedMail} from "../interfaces";


async function processMessageGmailApi(
  gmail: gmail_v1.Gmail,
  messageId: string
): Promise<ProcessedMail> {
  try {
    const messageDetails = await gmail.users.messages
      .get({userId: "me", id: messageId});

    const payload: gmail_v1.Schema$MessagePart | undefined =
      messageDetails.data.payload;

    if (!payload) {
      throw new Error("No payload in message details");
    }

    const headers: gmail_v1.Schema$MessagePartHeader[] = payload.headers || [];
    const subjectHeader: gmail_v1.Schema$MessagePartHeader | undefined =
      headers.find((header) => header.name === "Subject");
    const header: string = subjectHeader?.value?.trim() || "";

    const messageBody: string = getGmailMessageBody(payload);
    const extractedFields: MailFields = extractGmailFields(messageBody, header);

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
): Promise<ProcessedMail[]> {
  const messages: gmail_v1.Schema$Message[] =
    await getGmailHistoryGmailApi({gmail, dateFrom, dateTo});

  const processData: ProcessedMail[] = await Promise.all(
    messages.map((message) => processMessageGmailApi(gmail, message.id!))
  );

  return processData;
}


export {handleGmailDataGmailApi};


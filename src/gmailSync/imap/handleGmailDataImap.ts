import { simpleParser } from "mailparser";
import { extractGmailFields } from "../extractGmailFields";
import { getGmailHistoryImap } from "./getGmailHistoryImap";
import { Message } from "imap-simple";


async function processMessageImap(message: Message) {
  let messageId = "unkown";

  try {
    const allBodyParts = message.parts.filter((part) => part.which === "");

    if (allBodyParts.length === 0) {
      throw new Error("No message body found");
    }

    const fullBody = allBodyParts.map((part) => part.body).join("\n");

    const parsed = await simpleParser(fullBody);

    const subject = (parsed.headers.get("subject") as string) ?? "";

    const obj = extractGmailFields(
      parsed.text || parsed.html || "",
      subject
    );

    messageId = message.attributes["x-gm-msgid"];

    if (!messageId) {
      throw new Error("Message ID (x-gm-msgid) is missing");
    }

    return {
      id: messageId,
      ...obj,
    };
  } catch (error) {
    console.error("Error processing message:", error);

    throw new Error(
      `Failed to process message with ID ${messageId}`
    );
  }
}


async function handleGmailDataImap(
  dateFrom: number,
  dateTo: number
) {
  const messages = await getGmailHistoryImap(dateFrom, dateTo);

  const processData = await Promise.all(
    messages.map((message) => processMessageImap(message))
  );

  return processData;
}


export { handleGmailDataImap };

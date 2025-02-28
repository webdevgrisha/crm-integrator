import {ParsedMail, simpleParser} from "mailparser";
import {extractGmailFields} from "../extractGmailFields";
import {getGmailHistoryImap} from "./getGmailHistoryImap";
import {Message, MessageBodyPart} from "imap-simple";
import {MailFields, ProcessedMail} from "../interfaces";


async function processMessageImap(
  message: Message
): Promise<ProcessedMail> {
  let messageId = "unkown";

  try {
    const allBodyParts: MessageBodyPart[] =
      message.parts.filter((part) => part.which === "");

    if (allBodyParts.length === 0) {
      throw new Error("No message body found");
    }

    const fullBody: string = allBodyParts.map((part) => part.body).join("\n");

    const parsed: ParsedMail = await simpleParser(fullBody);

    const subject: string = (parsed.headers.get("subject") as string) ?? "";

    const messageBody: string = parsed.text || parsed.html || "";

    const obj: MailFields = extractGmailFields(
      messageBody,
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
): Promise<ProcessedMail[]> {
  const messages: Message[] = await getGmailHistoryImap(dateFrom, dateTo);

  const processData: ProcessedMail[] = await Promise.all(
    messages.map((message) => processMessageImap(message))
  );

  return processData;
}


export {handleGmailDataImap};

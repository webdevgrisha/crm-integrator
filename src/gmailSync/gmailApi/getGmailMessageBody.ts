/* eslint-disable @typescript-eslint/no-explicit-any, camelcase */
import {gmail_v1} from "googleapis";


function getGmailMessageBody(
  payload: gmail_v1.Schema$MessagePart
): string {
  try {
    if (payload.body && payload.body.data) {
      return Buffer.from(payload.body.data, "base64").toString("utf-8");
    }

    if (payload.parts) {
      for (const part of payload.parts) {
        if (part.body && part.body.data) {
          return Buffer.from(part.body.data, "base64").toString("utf-8");
        }
      }
    }

    return "";
  } catch (error) {
    console.error("Error while extracting message body:", error);

    throw new Error("Failed to get message body!");
  }
}


export {getGmailMessageBody};

import nodemailer, {SentMessageInfo} from "nodemailer";
import {getSecret} from "./getSecret";
import {ServiceNames} from "../enums";

interface SendEmailData {
  subject: string;
  text: string;
}

interface GmailInfo {
  user: string;
  pass: string;
  receiver: string;
}

type IsSend = boolean;

async function sendEmail(
  data: SendEmailData
): Promise<IsSend> {
  try {
    const gmailInfo: GmailInfo = JSON.parse(await getSecret("gmail-info"));

    const transporter: nodemailer.Transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: gmailInfo.user,
        pass: gmailInfo.pass,
      },
    });

    const info: SentMessageInfo = await transporter.sendMail({
      from: gmailInfo.user,
      to: gmailInfo.receiver,
      ...data,
    });

    console.log("Email sent successfully:", info.messageId);

    return true;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Failed to send email:", error.message);
      console.error("Stack trace:", error.stack);
    } else {
      console.error("Unknown error occurred while sending email:", error);
    }

    return false;
  }
}

async function sendErrorEmail(
  serviceName: ServiceNames
): Promise<IsSend> {
  const time: string = new Date().toISOString();

  const transportOptions: SendEmailData = {
    subject: `Synchronization errors with "${serviceName}" !`,
    text: `
            There was an error when trying to synchronize with: ${serviceName}
            Error time: ${time}
            `,
  };

  const sendStatus: IsSend = await sendEmail(transportOptions);

  return sendStatus;
}

async function sendFixedEmail(
  serviceName: ServiceNames
): Promise<IsSend> {
  const time: string = new Date().toISOString();

  const transportOptions: SendEmailData = {
    subject: `Synchronization issue with "${serviceName}" resolved!`,
    text: `
            The synchronization issue with: ${serviceName} has been resolved.
            Resolution time: ${time}
            `,
  };

  const sendStatus: IsSend = await sendEmail(transportOptions);

  return sendStatus;
}

export {sendErrorEmail, sendFixedEmail};

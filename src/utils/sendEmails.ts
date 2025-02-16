import nodemailer from "nodemailer";
import {getSecret} from "./getSecret";

function getErrorEmailOptions(serviceName: string, time: string) {
  const transportOptions = {
    subject: `Synchronization errors with "${serviceName}" !`,
    text: `
            There was an error when trying to synchronize with: ${serviceName}
            Error time: ${time}
            `,
  };

  return transportOptions;
}

async function getFixedEmailOptions(serviceName: string, time: string) {
  const transportOptions = {
    subject: `Synchronization issue with "${serviceName}" resolved!`,
    text: `
            The synchronization issue with: ${serviceName} has been resolved.
            Resolution time: ${time}
            `,
  };

  return transportOptions;
}

async function sendEMail(serviceName: string, isError: boolean) {
  try {
    const gmailInfo = JSON.parse(await getSecret("gmail-info"));
    const sendTime = new Date().toISOString();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: gmailInfo.user,
        pass: gmailInfo.pass,
      },
    });

    const transportOptions = isError ?
      getErrorEmailOptions(serviceName, sendTime) :
      getFixedEmailOptions(serviceName, sendTime);

    const info = await transporter.sendMail({
      from: gmailInfo.user,
      to: gmailInfo.receiver,
      ...transportOptions,
    });

    console.log("Email sent successfully:", info.messageId);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Failed to send email:", error.message);
      console.error("Stack trace:", error.stack);
    } else {
      console.error("Unknown error occurred while sending email:", error);
    }

    throw new Error("Failed to send email");
  }
}

export {sendEMail};

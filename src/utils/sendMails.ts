import nodemailer from "nodemailer";
import {getSecret} from "./getSecret";

async function sendErrorEmail(serviceName: string) {
  try {
    const gmailInfo = JSON.parse(await getSecret("gmail-info"));
    const errorTime = new Date().toISOString();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: gmailInfo.user,
        pass: gmailInfo.pass,
      },
    });

    const info = await transporter.sendMail({
      from: gmailInfo.user,
      to: gmailInfo.receiver,
      subject: `Synchronization errors with "${serviceName}" !`,
      text: `
            There was an error when trying to synchronize with: ${serviceName}
            Error time: ${errorTime}
            `,
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

// cтоит ли объеденить в одну функцию и передавать параметры ошибка это или нет.
async function sendFixedEmail(serviceName: string) {
  try {
    const gmailInfo = JSON.parse(await getSecret("gmail-info"));
    const fixedTime = new Date().toISOString();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: gmailInfo.user,
        pass: gmailInfo.pass,
      },
    });

    const info = await transporter.sendMail({
      from: gmailInfo.user,
      to: gmailInfo.receiver,
      subject: `Synchronization issue with "${serviceName}" resolved!`,
      text: `
            The synchronization issue with: ${serviceName} has been resolved.
            Resolution time: ${fixedTime}
            `,
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

export {sendErrorEmail, sendFixedEmail};

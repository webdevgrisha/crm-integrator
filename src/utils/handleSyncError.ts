import admin from "../init";
import {ErrorData} from "./interfaces";
import {sendErrorEmail} from "./sendErrorMail";


const firestoreDb = admin.firestore();

async function processSyncError(serviceName: string): Promise<void> {
  try {
    const docRef = firestoreDb.collection("error_handle").doc(serviceName);

    // не уверен, что тут нужна тарназакция
    await firestoreDb.runTransaction(async (transaction) => {
      const doc = await docRef.get();

      if (!doc.exists) {
        throw Error(`Document for service "${serviceName}" does not exist.`);
      }

      const data = doc.data() as ErrorData | undefined;

      if (!data) {
        throw Error(`Data for service "${serviceName}" does not exist.`);
      }

      // логи выглядят странно (с отправкой ошибки на почту)
      if (!data.isError || !data.isSendEmail) {
        const currentTimestamp = admin.firestore.Timestamp.now();
        let isEmailSend = false;

        try {
          sendErrorEmail(serviceName);
          isEmailSend = true;
        } catch (emailError) {
          console.error(
            `Error sending email for service "${serviceName}":`, emailError
          );
        }

        transaction.update(docRef, {
          isError: true,
          isSendEmail: isEmailSend,
          errorTime: currentTimestamp,
        });
      }
    });

    console.log(
      `Handled sync error for service "${serviceName}" successfully.`
    );
  } catch (error) {
    console.error(
      `Error handling sync error for service "${serviceName}":`, error
    );

    throw new Error(`Failed to handle sync error for service "${serviceName}"`);
  }
}

async function resetSyncErrorState(serviceName: string): Promise<void> {
  try {
    const docRef = firestoreDb.collection("error_handle").doc(serviceName);

    const doc = await docRef.get();

    if (!doc.exists) {
      throw Error(`Document for service "${serviceName}" does not exist.`);
    }

    const data = doc.data() as ErrorData | undefined;

    if (!data) {
      // стоит ли добавить логирование в таких случаях ?
      throw Error(`Data for service "${serviceName}" does not exist.`);
    }

    if (!data.isError) return;

    await docRef.update({
      isError: false,
      isSendEmail: false,
      errorTime: null,
    });

    console.log(`Reset sync error for service "${serviceName}" successfully.`);
  } catch (error) {
    console.error(
      `Error resetting sync error for service "${serviceName}":`, error
    );

    throw new Error(`Failed to reset sync error for service "${serviceName}"`);
  }
}

export {processSyncError, resetSyncErrorState};

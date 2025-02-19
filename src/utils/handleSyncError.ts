import admin from "../init";
import {ErrorData} from "./interfaces";
import {sendEmail} from "./sendEmails";


const firestoreDb = admin.firestore();

async function processSyncError(serviceName: string): Promise<void> {
  try {
    const docRef = firestoreDb.collection("error_handle").doc(serviceName);

    const doc = await docRef.get();

    if (!doc.exists) {
      throw Error(`Document for service "${serviceName}" does not exist.`);
    }

    const data = doc.data() as ErrorData | undefined;

    if (!data) {
      throw Error(`Data for service "${serviceName}" does not exist.`);
    }

    // логика выглядят странно (с отправкой ошибки на почту)
    if (!data.isError || !data.isSendEmail) {
      const currentTimestamp = admin.firestore.Timestamp.now();

      const sendStatus = await sendEmail(serviceName, true);

      docRef.update({
        isError: true,
        isSendEmail: sendStatus,
        errorTime: currentTimestamp,
      });
    }

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

    if (!data.isError && !data.isSendEmail) return;

    const sendStatus = await sendEmail(serviceName, false);

    await docRef.update({
      isError: false,
      isSendEmail: !sendStatus,
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

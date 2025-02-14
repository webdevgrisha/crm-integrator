import admin from "../init";
import { ErrorData } from "./interfaces";
import { sendEMail } from "./sendEmails";


const firestoreDb = admin.firestore();

async function processSyncError(serviceName: string): Promise<void> {
  try {
    const docRef = firestoreDb.collection("error_handle").doc(serviceName);

    // убрал транзакцию
    const doc = await docRef.get();

    if (!doc.exists) {
      throw Error(`Document for service "${serviceName}" does not exist.`);
    }

    const data = doc.data() as ErrorData | undefined;

    if (!data) {
      throw Error(`Data for service "${serviceName}" does not exist.`);
    }

    // логика выглядят странно (с отправкой ошибки на почту)
    if (!data.isError) {
      const currentTimestamp = admin.firestore.Timestamp.now();

      // то есть если упадет отправка сообщения данные не будут
      // обновлены 
      sendEMail(serviceName, true);

      docRef.update({
        isError: true,
        isSendEmail: true,
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

    if (!data.isError) return;

    await docRef.update({
      isError: false,
      isSendEmail: false,
      errorTime: null,
    });

    // a елси произойдет ошибка при отправки письма ?
    await sendEMail(serviceName, false);

    console.log(`Reset sync error for service "${serviceName}" successfully.`);
  } catch (error) {
    console.error(
      `Error resetting sync error for service "${serviceName}":`, error
    );

    throw new Error(`Failed to reset sync error for service "${serviceName}"`);
  }
}

export { processSyncError, resetSyncErrorState };

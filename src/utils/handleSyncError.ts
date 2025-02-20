import admin from "../init";
import {ChannelNames} from "../types";
import {ErrorData} from "./interfaces";
import {sendEmail} from "./sendEmails";


const firestoreDb = admin.firestore();

async function handleSyncErrorState(
  serviceName: ChannelNames,
  shouldSetError: boolean
): Promise<void> {
  const docRef = firestoreDb.collection("error_handle").doc(serviceName);
  const doc = await docRef.get();

  if (!doc.exists) {
    throw new Error(`Document for service "${serviceName}" does not exist.`);
  }

  const data = doc.data() as ErrorData | undefined;
  if (!data) {
    throw new Error(`Data for service "${serviceName}" does not exist.`);
  }

  if (shouldSetError) {
    setError(docRef, data, serviceName);
  } else {
    resetError(docRef, data, serviceName);
  }
}

async function setError(
  docRef: admin.firestore.DocumentReference,
  data: ErrorData,
  serviceName: ChannelNames
): Promise<void> {
  if (!data.isError || !data.isSendEmail) {
    const sendStatus = await sendEmail(serviceName, true);

    await docRef.update({
      isError: true,
      isSendEmail: sendStatus,
      errorTime: admin.firestore.Timestamp.now(),
    });
  }
}

async function resetError(
  docRef: admin.firestore.DocumentReference,
  data: ErrorData,
  serviceName: ChannelNames
): Promise<void> {
  if (data.isError || data.isSendEmail) {
    const sendStatus = await sendEmail(serviceName, false);

    await docRef.update({
      isError: false,
      isSendEmail: !sendStatus,
      errorTime: null,
    });
  }
}

export {handleSyncErrorState};

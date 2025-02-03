import admin from "../init";
import {format} from "date-fns";
import {Timestamp} from "firebase/firestore";

const firestoreDb = admin.firestore();

async function getDateFrom(docId: string) {
  try {
    const docRef = firestoreDb.collection("update_time").doc(docId);

    const doc = await docRef.get();

    if (!doc.exists) {
      throw Error("doc does not exist");
    }

    const data = doc.data();

    if (!(data && data.date)) {
      throw Error("date not exist");
    }

    const timestamp: Timestamp = data.date;
    const isoFormat: string = timestamp.toDate().toISOString();
    const epochTime: number = Math.floor(
      timestamp.toDate().getTime() / 1000
    );

    return {
      dateFromTimestamp: timestamp,
      dateFromIsoDate: isoFormat,
      dateFromEpochTime: epochTime,
    };
  } catch (error) {
    console.error("Error getting epoch time:", error);

    throw new Error(`Failed to get epoch time from the document: ${docId}`);
  }
}

function getDateTo() {
  try {
    const timestamp = admin.firestore.Timestamp.now();
    const isoFormat = timestamp.toDate().toISOString();
    const epochTime: number = Math.floor(
      timestamp.toDate().getTime() / 1000
    );

    return {
      dateToTimestamp: timestamp,
      dateToIsoFormat: isoFormat,
      dateToEpochTime: epochTime,
    };
  } catch (error) {
    console.error("Error getting date formats:", error);

    throw new Error("Failed to get date formats");
  }
}

async function updateDateFrom(
  currentTimestamp: FirebaseFirestore.Timestamp,
  docId: string
) {
  try {
    const docRef = firestoreDb.collection("update_time").doc(docId);

    const doc = await docRef.get();

    if (!doc.exists) {
      throw Error("doc does not exist");
    }

    const incrementedTimestamp = new admin.firestore.Timestamp(
      currentTimestamp.seconds + 1,
      currentTimestamp.nanoseconds
    );

    await docRef.update({
      date: incrementedTimestamp,
    });

    console.log(`Successfully updated date for document "${docId}".`);
  } catch (error) {
    console.error("Error when updating a document:", error);

    throw new Error(`Failed to update time in the document: ${docId}`);
  }
}

function formatTimestampToDate(timestamp: number): string {
  const date = new Date(timestamp);
  return format(date, "dd-MMM-yyyy");
}

export {
  getDateFrom,
  getDateTo,
  updateDateFrom,
  formatTimestampToDate,
};

import admin from "../init";
import {format} from "date-fns";
import {Timestamp} from "firebase/firestore";

const firestoreDb = admin.firestore();

interface DateFromFormats {
  dateFromTimestamp: Timestamp;
  dateFromIsoDate: string;
  dateFromEpochTime: number;
}

async function getDateFrom(docId: string): Promise<DateFromFormats> {
  try {
    const docRef = firestoreDb.collection("update_time").doc(docId);

    const doc = await docRef.get();

    if (!doc.exists) {
      throw Error("doc does not exist");
    }

    const data = doc.data();

    const timestamp: Timestamp = data?.date;

    if (!timestamp) throw Error("date not exist");

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

interface DateToFormats {
  dateToTimestamp: admin.firestore.Timestamp;
  dateToIsoFormat: string;
  dateToEpochTime: number;
}

function getDateTo(): DateToFormats {
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
): Promise<void> {
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

type DateStr = string

function formatTimestampToDate(timestamp: number): DateStr {
  const date = new Date(timestamp);
  return format(date, "dd-MMM-yyyy");
}

export {
  getDateFrom,
  getDateTo,
  updateDateFrom,
  formatTimestampToDate,
};

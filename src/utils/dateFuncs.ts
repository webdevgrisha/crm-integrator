import admin from "../init";
import {format} from "date-fns";
import {Timestamp} from "firebase/firestore";

const firestoreDb = admin.firestore();

async function getISO8601DateFrom(docId: string) {
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
    const isoDate: string = timestamp.toDate().toISOString();

    return {isoDate, timestamp};
  } catch (error) {
    console.error("Error getting ISO8601 date:", error);

    throw new Error(`Failed to get ISO8601 date from the document: ${docId}`);
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

async function getEpochTimeDateFrom(docId: string) {
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
    const epochTime: number = Math.floor(timestamp.toDate().getTime() / 1000);

    return {epochTime, timestamp};
  } catch (error) {
    console.error("Error getting epoch time:", error);

    throw new Error(`Failed to get epoch time from the document: ${docId}`);
  }
}

function getDateFormats() {
  try {
    const currentTimestamp = admin.firestore.Timestamp.now();
    const isoFormat = currentTimestamp.toDate().toISOString();
    const epochTime: number = Math.floor(
      currentTimestamp.toDate().getTime() / 1000
    );

    return {
      currentTimestamp,
      dateToIsoFormat: isoFormat,
      dateToEpochTime: epochTime,
    };
  } catch (error) {
    console.error("Error getting date formats:", error);

    throw new Error("Failed to get date formats");
  }
}

function formatTimestampToDate(timestamp: number): string {
  const date = new Date(timestamp);
  return format(date, "dd-MMM-yyyy");
}

export {
  getISO8601DateFrom,
  updateDateFrom,
  getEpochTimeDateFrom,
  getDateFormats,
  formatTimestampToDate,
};

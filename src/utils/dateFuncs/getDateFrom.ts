import {Timestamp} from "firebase-admin/firestore";
import {firestoreDb} from "../../init";


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


export {
  getDateFrom,
};

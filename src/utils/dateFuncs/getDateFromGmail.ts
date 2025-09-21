import {Timestamp} from "firebase-admin/firestore";
import {firestoreDb} from "../../init";


interface DateFromFormats {
  dateFromSaveTimestamp: Timestamp;
  dateFromCheckTimestamp: Timestamp;
  dateFromIsoCheckDate: string;
  dateFromEpochCheckTime: number;
}

async function getDateFromGmail(docId: string): Promise<DateFromFormats> {
  console.log("getDateFromGmail");
  try {
    const docRef = firestoreDb.collection("update_time").doc(docId);

    const doc = await docRef.get();

    if (!doc.exists) {
      throw Error("doc does not exist");
    }

    const data = doc.data();

    const saveTimestamp: Timestamp = data?.date;

    if (!saveTimestamp) throw Error("date not exist");

    const originalSaveDate = saveTimestamp.toDate();

    const checkDate: Date = new Date(
      originalSaveDate.getTime() - (2 * 60 * 60 * 1000)
    );

    const checkTimestamp: Timestamp =
      Timestamp.fromDate(checkDate);

    const isoFormat: string = checkTimestamp.toDate().toISOString();
    const epochTime: number = Math.floor(
      checkTimestamp.toDate().getTime() / 1000
    );

    console.log(`Date from: ${isoFormat}`);

    return {
      dateFromSaveTimestamp: saveTimestamp,
      dateFromCheckTimestamp: checkTimestamp,
      dateFromIsoCheckDate: isoFormat,
      dateFromEpochCheckTime: epochTime,
    };
  } catch (error) {
    console.error("Error getting epoch time:", error);

    throw new Error(`Failed to get epoch time from the document: ${docId}`);
  }
}


export {
  getDateFromGmail,
};

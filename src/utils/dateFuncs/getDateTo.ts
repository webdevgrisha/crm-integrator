import {admin} from "../../init";

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

export {
  getDateTo,
};

import admin from "../init";
import {ProcessedLeadInfo} from "../interfaces";

const firestoreDb = admin.firestore();

async function saveProcessedLeadInfo(
  processedLeadsInfo: ProcessedLeadInfo[],
  serviceName: string
) {
  try {
    const collectionRef = firestoreDb
      .collection("lead_services")
      .doc(serviceName)
      .collection("leads");

    const batch = firestoreDb.batch();

    processedLeadsInfo.forEach((leadInfo) => {
      const newDocRef = collectionRef.doc(String(leadInfo.serviceLeadId));
      batch.set(newDocRef, leadInfo);
    });

    await batch.commit();

    console.log("Processed leads info successfully saved.");
  } catch (error) {
    console.error("Error saving processed leads info:", error);

    throw new Error("Failed to save processed leads info");
  }
}


export {saveProcessedLeadInfo};

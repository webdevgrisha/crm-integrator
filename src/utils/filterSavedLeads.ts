import admin from "../init";
import {ProcessedLeadInfo} from "../interfaces";
import {ErrorData} from "./interfaces";

const firestoreDb = admin.firestore();

interface SavedLeads {
  [key: string | number]: ProcessedLeadInfo;
}

async function filterSavedLeads(
  serviceName: string,
  dateFrom: FirebaseFirestore.Timestamp
) {
  try {
    const savedLeads: SavedLeads = {};

    const errorHandleDocRef = firestoreDb
      .collection("error_handle")
      .doc(serviceName);
    const errorHandleDoc = await errorHandleDocRef.get();
    const errorHandleData = errorHandleDoc.data() as ErrorData | undefined;

    if (!errorHandleData?.isError) {
      return savedLeads;
    }

    const collectionRef = firestoreDb
      .collection("lead_services")
      .doc(serviceName)
      .collection("leads");

    const querySnapshot = await collectionRef
      .where("dateFrom", "==", dateFrom)
      .get();

    if (querySnapshot.empty) {
      return savedLeads;
    }

    querySnapshot.forEach((doc) => {
      const docData = doc.data() as ProcessedLeadInfo;
      const docId = doc.id;

      if (docData.createdLeadId) return;

      savedLeads[docId] = docData;
    });

    console.log(
      // eslint-disable-next-line max-len
      `Filtered ${Object.keys(savedLeads).length} leads for service: ${serviceName}`
    );

    return savedLeads;
  } catch (error) {
    console.error("Error filtering saved leads:", error);

    throw new Error("Failed to filter saved leads");
  }
}

export {filterSavedLeads};

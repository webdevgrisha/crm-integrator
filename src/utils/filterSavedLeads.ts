import {ServiceNames} from "../enums";
import {firestoreDb} from "../init";
import {ProcessedLeadInfo} from "../interfaces";
import {ErrorData} from "./interfaces";


interface SavedLeads {
  [key: string | number]: ProcessedLeadInfo;
}

interface FilterSavedLeads {
  serviceName: ServiceNames;
  dateFrom: FirebaseFirestore.Timestamp;
  checkError: boolean;
}

async function filterSavedLeads(
  data: FilterSavedLeads
): Promise<SavedLeads> {
  const {serviceName, dateFrom, checkError} = data;

  const savedLeads: SavedLeads = {};

  try {
    console.log(`Starting to filter saved leads for service: ${serviceName}`);


    if (checkError) {
      const errorHandleDocRef = firestoreDb
        .collection("error_handle")
        .doc(serviceName);
      const errorHandleDoc = await errorHandleDocRef.get();
      const errorHandleData = errorHandleDoc.data() as ErrorData | undefined;

      if (!errorHandleData?.isError) {
        console.log(
          // eslint-disable-next-line max-len
          `No error found for service: ${serviceName}. Skipping filtering saved leads.`
        );
        return savedLeads;
      }
    }


    const collectionRef = firestoreDb
      .collection("lead_services")
      .doc(serviceName)
      .collection("leads");

    const querySnapshot = await collectionRef
      .where("dateFrom", ">=", dateFrom)
      .get();

    if (querySnapshot.empty) {
      // eslint-disable-next-line max-len
      console.log(`No leads found for service: ${serviceName} starting from date: ${dateFrom.toDate()}`);
      return savedLeads;
    }

    console.log(
      // eslint-disable-next-line max-len
      `Found ${querySnapshot.size} leads for service: ${serviceName} starting from date: ${dateFrom.toDate()}`
    );

    querySnapshot.forEach((doc) => {
      const docData = doc.data() as ProcessedLeadInfo;
      const docId = doc.id;

      // if (docData.createdLeadId) return;

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

export type {SavedLeads};

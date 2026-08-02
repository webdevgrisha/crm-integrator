import {ServiceNames} from "../enums";
import {firestoreDb} from "../init";
import {ProcessedLeadInfo} from "../interfaces";


interface SavedLeads {
  [key: string | number]: ProcessedLeadInfo;
}

interface FilterSavedLeads {
  serviceName: ServiceNames;
  serviceLeadIds: Array<string | number>;
}

async function filterSavedLeads(
  data: FilterSavedLeads
): Promise<SavedLeads> {
  const {serviceName, serviceLeadIds} = data;

  const savedLeads: SavedLeads = {};

  try {
    console.log(`Starting to filter saved leads for service: ${serviceName}`);

    const collectionRef = firestoreDb
      .collection("lead_services")
      .doc(serviceName)
      .collection("leads");

    const uniqueLeadIds = Array.from(new Set(serviceLeadIds.map(String)));

    if (!uniqueLeadIds.length) {
      console.log(`No lead IDs to check for service: ${serviceName}`);
      return savedLeads;
    }

    const leadDocs = await Promise.all(
      uniqueLeadIds.map((id) => collectionRef.doc(id).get())
    );

    if (!leadDocs.some((doc) => doc.exists)) {
      console.log(`No saved leads found for service: ${serviceName}`);
      return savedLeads;
    }

    leadDocs.forEach((doc) => {
      if (!doc.exists) return;

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

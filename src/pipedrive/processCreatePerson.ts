import { ServiceNames } from "../enums";
import { SavedLeads } from "../utils/filterSavedLeads";
import { createPerson, CreatePersonFields } from "./createPerson";
import { findPerson } from "./findPerson";

interface ProcessCreatePersonData {
  id: string | number;
  serviceName: ServiceNames;
  savedLeads: SavedLeads;
  personObj: CreatePersonFields;
}

async function processCreatePerson(
  data: ProcessCreatePersonData
) {
  const { id, serviceName, savedLeads, personObj } = data;
  let personId: number;

  console.log(`[${serviceName}] Processing person creation for ID: ${id}`);

  if (savedLeads[id]?.createdPersonId) {
    personId = savedLeads[id].createdPersonId as number;

    console.log(
      `[${serviceName}] Found existing person with ID: ${personId}`
    );
  } else {
    const existingPersonId = await findPerson(personObj);

    if (existingPersonId) {
      personId = existingPersonId;

      console.log(
        `[${serviceName}] Found matching person with ID: ${personId}`
      );
    } else {
      personId = await createPerson(personObj);
    }
  }

  return personId;
}

export { processCreatePerson };

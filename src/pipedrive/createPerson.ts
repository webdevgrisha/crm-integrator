import {pipedriveConfig} from "../projectConfig";
import {PersonCustomFields} from "../projectConfig/pipedriveConfig/enums";
import {PersonConfig} from "../projectConfig/pipedriveConfig/pipedriveConfig";
import {getSecret} from "../utils/getSecret";
/* eslint-disable @typescript-eslint/no-var-requires */
const pipedrive = require("pipedrive");
/* eslint-enable @typescript-eslint/no-var-requires */


interface CreatePersonFields {
  phone: string;
  email?: string | null;
  personName?: string | undefined;
  callData?: string | null;
  callTime?: string | null;
  callRealise?: "Tak" | "Nie",
}

type PersonId = number;

async function createPerson(
  createPersonFields: CreatePersonFields
): Promise<PersonId> {
  const {
    phone,
    email = null,
    personName = "Unkown",
    callData = null,
    callTime = null,
    callRealise = "Nie",
  } = createPersonFields;

  console.log(
    "Starting to create person with the following fields:", createPersonFields
  );

  try {
    const apiKey = await getSecret(pipedriveConfig.apiKeyName);

    const personConfig: PersonConfig = pipedriveConfig.personConfig;

    const defaultClient = new pipedrive.ApiClient();
    defaultClient.authentications.api_key.apiKey = apiKey;

    const fieldsApi = new pipedrive.PersonFieldsApi(defaultClient);
    const personApi = new pipedrive.PersonsApi(defaultClient);

    // custom fields
    const personDayField = await fieldsApi.getPersonField(
      PersonCustomFields.Day
    );
    const personHourField = await fieldsApi.getPersonField(
      PersonCustomFields.Hour
    );
    const callStatusField = await fieldsApi.getPersonField(
      PersonCustomFields.CallStatus
    );

    const data = {
      name: personName,
      phone: phone,
      email: email,
      // visibility groups
      visible_to: personConfig.visible_to,
      // custom fields
      [personDayField.data.key]: callData,
      [personHourField.data.key]: callTime,
      [callStatusField.data.key]: callRealise,
    };

    const response = await personApi.addPerson(data);
    const personId: number = response.data.id;

    console.log(`Created new person with ID: ${personId}`);

    return personId;
  } catch (err) {
    if (err instanceof Error) {
      console.error("Create a person failed", err.message);

      throw new Error(`Create a person failed: ${err.message}`);
    } else {
      console.error("Create person failed with unknown error", err);

      throw new Error(
        `Create a person failed with an unknown error: ${err}`
      );
    }
  }
}

export {
  createPerson,
};

export type {
  CreatePersonFields,
  PersonId,
};

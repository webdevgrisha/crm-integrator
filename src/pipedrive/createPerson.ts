import {pipedriveConfig} from "../projectConfig";
import {PersonFieldKeys} from "../projectConfig/pipedriveConfig/enums";
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

    const personApi = new pipedrive.PersonsApi(defaultClient);

    const data = {
      name: personName,
      phone: phone,
      email: email,
      // visibility groups
      visible_to: personConfig.visible_to,
      // custom fields
      [PersonFieldKeys.Day]: callData,
      [PersonFieldKeys.Hour]: callTime,
      [PersonFieldKeys.CallStatus]: callRealise,
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

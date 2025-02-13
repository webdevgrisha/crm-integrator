import { pipedriveConfig } from "../projectConfig";
import {getSecret} from "../utils/getSecret";
/* eslint-disable @typescript-eslint/no-var-requires */
const pipedrive = require("pipedrive");
/* eslint-enable @typescript-eslint/no-var-requires */

async function createPerson(
  phone: string,
  email: string | null = null,
  name: string | undefined = "Unkown",
  callData: string | null = null,
  callTime: string | null = null,
  callRealise = "Nie",
) {
  try {
    const apiKey = await getSecret(pipedriveConfig.apiKeyName);

    const personConfig = pipedriveConfig.personConfig; 

    const defaultClient = new pipedrive.ApiClient();
    defaultClient.authentications.api_key.apiKey = apiKey;

    const fieldsApi = new pipedrive.PersonFieldsApi(defaultClient);
    const personApi = new pipedrive.PersonsApi(defaultClient);

    // custom fields
    const personDayField = await fieldsApi.getPersonField(
      personConfig.customFields.personDayField
    );
    const personHourField = await fieldsApi.getPersonField(
      personConfig.customFields.personHourField
    );
    const callStatusField = await fieldsApi.getPersonField(
      personConfig.customFields.callStatusField
    );

    const data = {
      name: name,
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
        `Create a person failed with an unknown error: ${(err as any)?.message}`
      );
    }
  }
}

export {
  createPerson,
};

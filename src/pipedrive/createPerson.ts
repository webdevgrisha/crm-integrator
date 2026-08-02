import { AddPersonRequest, PersonsApi } from "pipedrive/v2";
import { pipedriveConfig } from "../projectConfig";
import { PersonFieldKeys } from "../projectConfig/pipedriveConfig/enums";
import { PersonConfig } from "../projectConfig/pipedriveConfig/pipedriveConfig";
import { getPipedriveV2Config } from "./client";


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
    const personConfig: PersonConfig = pipedriveConfig.personConfig;
    const apiConfig = await getPipedriveV2Config();

    const personApi = new PersonsApi(apiConfig);
    const data: AddPersonRequest = {
      name: personName,
      phones: [{ value: phone, primary: true }],
      emails: email ? [{ value: email, primary: true }] : [],
      // visibility groups
      visible_to: Number(personConfig.visible_to),
      // custom fields
      custom_fields: {
        [PersonFieldKeys.Day]: callData,
        [PersonFieldKeys.Hour]: callTime,
        [PersonFieldKeys.CallStatus]: callRealise,
      },
    };

    const response = await personApi.addPerson({ AddPersonRequest: data });
    const personId = response.data?.id;

    if (!personId) {
      throw new Error("Pipedrive did not return created person ID");
    }

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

import {AddPersonRequest, PersonsApi} from "pipedrive/v2";
import {pipedriveConfig} from "../projectConfig";
import {PersonFieldKeys} from "../projectConfig/pipedriveConfig/enums";
import {PersonConfig} from "../projectConfig/pipedriveConfig/pipedriveConfig";
import {getPipedriveV2Config} from "./client";


interface CreatePersonFields {
  phone: string;
  email?: string | null;
  personName?: string | undefined;
  callData?: string | null;
  callTime?: string | null;
  callRealize?: "Tak" | "Nie";
}

type PersonId = number;

async function createPerson(
  createPersonFields: CreatePersonFields
): Promise<PersonId> {
  const {
    phone,
    email = null,
    personName,
    callData = null,
    callTime = null,
    callRealize = "Nie",
  } = createPersonFields;

  console.log(
    "Starting to create person with the following fields:", createPersonFields
  );

  try {
    const personConfig: PersonConfig = pipedriveConfig.personConfig;
    const apiConfig = await getPipedriveV2Config();

    const personApi = new PersonsApi(apiConfig);
    const customFields = {
      [PersonFieldKeys.Day]: callData,
      [PersonFieldKeys.Hour]: callTime,
      [PersonFieldKeys.CallStatus]: getCallStatusOptionId(
        callRealize,
        personConfig
      ),
    };
    const data: AddPersonRequest = {
      name: getPersonName({personName, phone, email}),
      phones: getPhones(phone),
      emails: getEmails(email),
      // visibility groups
      visible_to: Number(personConfig.visible_to),
      // custom fields
      custom_fields: customFields,
    };

    const response = await personApi.addPerson({AddPersonRequest: data});
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

function getCallStatusOptionId(
  callRealize: "Tak" | "Nie",
  personConfig: PersonConfig
): number {
  return callRealize === "Tak" ?
    personConfig.callStatusOptions.yes :
    personConfig.callStatusOptions.no;
}

function getPersonName(data: {
  personName?: string;
  phone: string;
  email?: string | null;
}): string {
  const {personName, phone, email} = data;

  return personName?.trim() ||
    phone.trim() ||
    email?.trim() ||
    "Unknown";
}

function getPhones(phone: string): AddPersonRequest["phones"] {
  const normalizedPhone = phone.trim();

  return normalizedPhone ?
    [{value: normalizedPhone, primary: true}] :
    [];
}

function getEmails(email?: string | null): AddPersonRequest["emails"] {
  const normalizedEmail = email?.trim();

  return normalizedEmail ?
    [{value: normalizedEmail, primary: true}] :
    [];
}

export {
  createPerson,
};

export type {
  CreatePersonFields,
  PersonId,
};

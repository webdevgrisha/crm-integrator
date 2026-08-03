import {PersonsApi} from "pipedrive/v2";
import {CreatePersonFields, PersonId} from "./createPerson";
import {getPipedriveV2Config} from "./client";

async function findPerson(
  personObj: CreatePersonFields
): Promise<PersonId | null> {
  const personApi = await getPersonApi();

  return findPersonByPhone(personApi, personObj.phone);
}

async function findPersonByPhone(
  personApi: PersonsApi,
  phone: string
): Promise<PersonId | null> {
  const phoneVariants = getPhoneVariants(phone);
  if (!phoneVariants.length) return null;

  const response = await personApi.searchPersons({
    term: phoneVariants[0],
    fields: "phone",
    exact_match: false,
    limit: 10,
  });
  const items = response.data?.items || [];
  const matchedPerson = items.find((searchItem) => {
    const phones = searchItem.item?.phones || [];

    return phones.some((candidatePhone) =>
      hasMatchingPhoneVariant(candidatePhone, phoneVariants)
    );
  });

  return matchedPerson?.item?.id || null;
}

async function getPersonApi(): Promise<PersonsApi> {
  const apiConfig = await getPipedriveV2Config();

  return new PersonsApi(apiConfig);
}

function getPhoneVariants(phone: string): string[] {
  const normalizedPhone = normalizePhone(phone);
  if (!normalizedPhone) return [];

  const variants = new Set([normalizedPhone]);

  if (normalizedPhone.startsWith("48") && normalizedPhone.length > 9) {
    variants.add(normalizedPhone.slice(2));
  }

  if (normalizedPhone.length === 9) {
    variants.add(`48${normalizedPhone}`);
  }

  return Array.from(variants);
}

function hasMatchingPhoneVariant(
  candidatePhone: string,
  phoneVariants: string[]
): boolean {
  const candidateVariants = getPhoneVariants(candidatePhone);

  return candidateVariants.some((variant) => phoneVariants.includes(variant));
}

function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

export {findPerson};

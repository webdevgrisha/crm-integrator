import * as bizSdk from "facebook-nodejs-business-sdk";
import Cursor from "facebook-nodejs-business-sdk/src/cursor";
import { facebookConfig } from "../projectConfig";
import { FacebookLeadData } from "./interfaces";

const LeadgenForm = bizSdk.LeadgenForm;

async function getFormLeads(
  formId: string,
  params: Record<string, unknown>
): Promise<FacebookLeadData[]> {
  let leads: Cursor | null = await new LeadgenForm(formId).getLeads(
    facebookConfig.formFields, params
  );
  const allLeads: FacebookLeadData[] = [];

  while (leads) {
    const typedLeads = leads as unknown as FacebookLeadData[];
    allLeads.push(...typedLeads);

    leads = leads.hasNext() ? await leads.next() : null;
  }

  return allLeads;
}

export { getFormLeads };

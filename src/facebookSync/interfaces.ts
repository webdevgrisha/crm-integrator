import {LeadDataNames} from "../projectConfig/facebookConfig";


interface LeadFiledData {
    name: LeadDataNames;
    values: string[];
}

interface FacebookLeadData {
    id: string;
    created_time: string;
    campaign_name: string;
    ad_name: string;
    field_data: LeadFiledData[];
}

interface FacebookLeadInfo {
    name: string;
    phone: string;
    email: string;
    callTime: string;
    carName: string;
    formBudget: string;
    purchasePlan: string;
    description?: string;
}

interface FacebookProcessData extends FacebookLeadInfo {
    id: string;
    adName: string;
    campaignName: string;
}

interface FacebookApiSecret {
    access_token: string;
    page_id: string;
}

interface FacebookLeadgenForm {
    id: string;
    name?: string;
    status?: string;
}

interface FacebookLeadgenFormsResponse {
    data?: FacebookLeadgenForm[];
    paging?: {
        cursors?: {
            after?: string;
        };
    };
}

export type {
  FacebookLeadData,
  FacebookLeadInfo,
  FacebookProcessData,
  FacebookApiSecret,
  FacebookLeadgenForm,
  FacebookLeadgenFormsResponse,
};

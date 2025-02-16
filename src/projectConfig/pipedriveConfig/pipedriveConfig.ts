import {leadConfig, LeadConfig} from "./leadConfig";
import {personConfig, PersonConfig} from "./personConfig";

interface PipedriveConfig {
    apiKeyName: string;
    personConfig: PersonConfig;
    leadConfig: LeadConfig;
}

const pipedriveConfig: PipedriveConfig = {
  apiKeyName: "pipedrive-api",
  leadConfig,
  personConfig,
};

export {
  pipedriveConfig,
};

import {Configuration as PipedriveV1Configuration} from "pipedrive/v1";
import {Configuration as PipedriveV2Configuration} from "pipedrive/v2";
import {pipedriveConfig} from "../projectConfig";
import {getSecret} from "../utils/getSecret";

async function getPipedriveV1Config(): Promise<PipedriveV1Configuration> {
  const apiKey = await getSecret(pipedriveConfig.apiKeyName);

  return new PipedriveV1Configuration({apiKey});
}

async function getPipedriveV2Config(): Promise<PipedriveV2Configuration> {
  const apiKey = await getSecret(pipedriveConfig.apiKeyName);

  return new PipedriveV2Configuration({apiKey});
}

export {
  getPipedriveV1Config,
  getPipedriveV2Config,
};

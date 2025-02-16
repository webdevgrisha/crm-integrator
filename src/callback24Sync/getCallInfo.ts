import {Callback24CallInfo} from "./interfaces";
import {getSecret} from "../utils/getSecret";
import {httpGet} from "../utils/http";
import {callback24Config} from "../projectConfig";


async function getCallInfo(callId: number) {
  try {
    const apiKey = await getSecret(callback24Config.apiKeyName);

    const headersConfig = {
      "X-API-TOKEN": apiKey,
    };

    const paramsConfig = {
      call_id: callId,
    };

    const response = await httpGet(
      callback24Config.getCallInfoEndPoint,
      headersConfig,
      paramsConfig,
      true
    );

    const callInfo = response.data.data;

    const callAtData = callInfo.call_at.split("T")[0];
    const callAtTime = callInfo.call_at.split("T")[1].slice(0, 8);

    const parsedURL = new URL(callInfo.website);
    const utmSource = parsedURL.searchParams.get("utm_source");
    const utmCampaign = parsedURL.searchParams.get("utm_campaign");

    const data: Callback24CallInfo = {
      callAtData,
      callAtTime,
      utmSource,
      utmCampaign,
    };

    return data;
  } catch (error) {
    console.error(`Error while retrieving data from getCallInfo: ${error}`);

    throw new Error(`Error while retrieving data from getCallInfo: ${error}`);
  }
}

export {getCallInfo};

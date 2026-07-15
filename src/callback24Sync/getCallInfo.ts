import { Callback24CallInfo } from "./interfaces";
import { getSecret } from "../utils/getSecret";
import { httpGet } from "../utils/http/http";
import { callback24Config } from "../projectConfig";
import logger from "../utils/logger";

interface CallInfoData {
  id: number;
  call_at: string;
  website: string | null;
  source: string
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

async function getCallInfo(
  callId: number
): Promise<Callback24CallInfo> {
  try {
    const apiKey = await getSecret(callback24Config.apiKeyName);

    const headersConfig = {
      "X-API-TOKEN": apiKey,
    };

    const paramsConfig = {
      call_id: callId,
    };

    const response = await httpGet(
      callback24Config.endPoint.getCallInfo,
      {
        headers: headersConfig,
        params: paramsConfig,
        isProxy: true,
      }
    );

    const callInfo: CallInfoData = response.data.data;

    const callAtData: string = callInfo.call_at.split("T")[0];
    const callAtTime: string = callInfo.call_at.split("T")[1].slice(0, 8);

    let utmSource = callInfo.source;
    let utmCampaign: string | null = null;
    let utmTerm: string | null = null;

    try {
      const parsedURL = new URL(callInfo.website as string);

      utmSource = parsedURL.searchParams.get("utm_source") || callInfo.source;
      utmCampaign = parsedURL.searchParams.get("utm_campaign");
      utmTerm = parsedURL.searchParams.get("utm_term");
    } catch (urlError) {
      logger.warn("Invalid callback24 website", {
        callId,
        website: callInfo.website,
        error: getErrorMessage(urlError),
      });
    }

    const data: Callback24CallInfo = {
      callAtData,
      callAtTime,
      utmSource,
      utmCampaign,
      utmTerm,
    };

    return data;
  } catch (error) {
    console.error(`Error while retrieving data from getCallInfo: ${error}`);

    throw new Error(`Error while retrieving data from getCallInfo: ${error}`);
  }
}

export { getCallInfo };

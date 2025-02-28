import {Callback24ClientInfo, Callback24History} from "./interfaces";
import {getSecret} from "../utils/getSecret";
import {httpGet} from "../utils/http/http";
import {callback24Config} from "../projectConfig";


async function getHistory(
  dateFrom: string,
  dateTo: string
): Promise<Callback24History[]> {
  try {
    const apiKey = await getSecret(callback24Config.apiKeyName);

    const headersConfig = {
      "X-API-TOKEN": apiKey,
      "Content-Type": "application/json",
    };

    const paramsConfig = {
      date_from: dateFrom,
      date_to: dateTo,
    };

    const response = await httpGet(
      callback24Config.endPoint.getHistory,
      {
        headers: headersConfig,
        params: paramsConfig,
        isProxy: true,
      }
    );

    const callHistoryArr: Callback24ClientInfo[] = response.data.result;

    const filter: Callback24ClientInfo[] = callHistoryArr.filter(
      (callbackInfo) => {
        return callbackInfo.service_name === callback24Config.filterServiceName;
      }
    );

    const reformatData = filter.map((data) => {
      const hasRealised = data.has_status_realised ? "Tak" : "Nie";

      const historyInfo: Callback24History = {
        id: data.id,
        hasRealised: hasRealised,
        phone: data.phone_number,
      };

      return historyInfo;
    });

    return reformatData;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error while retrieving data from getHistory:", error);

      throw new Error(
        `Error while retrieving data from getHistory: ${error.message}`
      );
    } else {
      console.error("Unexpected error:", error);

      throw new Error(
        "An unexpected error occurred while retrieving data from getHistory."
      );
    }
  }
}

export {getHistory};

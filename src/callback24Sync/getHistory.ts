import axios from "axios";
import {Callback24ClientInfo} from "./interfaces";
import {getSecret} from "../utils/getSecret";

async function getHistory(dateFrom: string, dateTo: string) {
  try {
    const proxy = JSON.parse(await getSecret("proxy"));
    const apiKey = await getSecret("callback24-api");

    const response = await axios.get("https://panel.callback24.io/api/v1/phoneCalls/history", {
      headers: {
        "X-API-TOKEN": apiKey,
        "Accept": "application/json",
        "Content-Type": "application/json",
        "User-Agent": "MyApp/1.0",
      },
      params: {
        date_from: dateFrom,
        date_to: dateTo,
      },
      proxy: {
        protocol: "http",
        host: proxy.host,
        port: proxy.port,
        auth: {
          username: proxy.username,
          password: proxy.password,
        },
      },
    });

    const filter: Callback24ClientInfo[] = response.data.result.filter(
      (callbackInfo: Callback24ClientInfo) => {
        return callbackInfo.service_name === "libertycar.pl";
      }
    );

    const reformatData = filter.map((data) => {
      const hasRealised = data.has_status_realised ? "Tak" : "Nie";

      return {
        id: data.id,
        hasRealised: hasRealised,
        phoneNumber: data.phone_number,
      };
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

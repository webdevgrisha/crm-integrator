import axios from "axios";
import {Callback24CallInfo} from "./interfaces";
import {getSecret} from "../utils/getSecret";


async function getCallInfo(callId: number) {
  try {
    const proxy = JSON.parse(await getSecret("proxy"));
    const apiKey = await getSecret("callback24-api");

    const response = await axios.get("https://panel.callback24.io/api/v1/phoneCalls/getCallInfo", {
      headers: {
        "X-API-TOKEN": apiKey,
        "Accept": "application/json",
        "User-Agent": "MyApp/1.0",
      },
      params: {
        call_id: callId,
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
    // или console.log ?
    console.error(`Error while retrieving data from getCallInfo: ${error}`);

    throw new Error(`Error while retrieving data from getCallInfo: ${error}`);
  }
}

export {getCallInfo};

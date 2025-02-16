import {ChannelNames} from "../types";

interface Callback24Config {
    serviceName: ChannelNames;
    filterServiceName: string;
    getHistoryEndPoint: string;
    getCallInfoEndPoint: string;
    apiKeyName: string;
    schedule: string;
    timeZone: string;
    region: string;
}

const callback24Config: Callback24Config = {
  serviceName: "callback24",
  filterServiceName: "libertycar.pl",
  getHistoryEndPoint: "https://panel.callback24.io/api/v1/phoneCalls/history",
  getCallInfoEndPoint: "https://panel.callback24.io/api/v1/phoneCalls/getCallInfo",
  apiKeyName: "callback24-api",
  schedule: "0 * * * *",
  timeZone: "Europe/Warsaw",
  region: "europe-central2",
};

export {
  callback24Config,
};

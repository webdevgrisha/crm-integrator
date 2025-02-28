import {ServiceNames} from "../enums";

interface Callback24Config {
  serviceName: ServiceNames;
  filterServiceName: string;
  endPoint: {
    getHistory: string;
    getCallInfo: string;
  }
  apiKeyName: string;
  cron: {
    schedule: string;
    timeZone: string;
    region: string;
  }
}

const callback24Config: Callback24Config = {
  serviceName: ServiceNames.Callback24,
  filterServiceName: "libertycar.pl",
  endPoint: {
    getHistory: "https://panel.callback24.io/api/v1/phoneCalls/history",
    getCallInfo: "https://panel.callback24.io/api/v1/phoneCalls/getCallInfo",
  },
  apiKeyName: "callback24-api",
  cron: {
    schedule: "0 * * * *",
    timeZone: "Europe/Warsaw",
    region: "europe-central2",
  },
};

export {
  callback24Config,
};

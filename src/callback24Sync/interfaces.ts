interface Callback24ClientInfo {
  id: number;
  phone_number: string;
  addition_time: string;
  service_name: string;
  has_status_realised: boolean;
}

interface Callback24History {
  id: number;
  hasRealised: "Tak" | "Nie";
  phone: string;
}

interface Callback24CallInfo {
  callAtData: string;
  callAtTime: string;
  utmSource: string;
  utmCampaign?: string | null;
}

interface Callback24ProcessData extends Callback24History, Callback24CallInfo {}


export type {
  Callback24ClientInfo,
  Callback24CallInfo,
  Callback24History,
  Callback24ProcessData,
};

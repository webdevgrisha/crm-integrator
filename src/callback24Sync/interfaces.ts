interface Callback24ClientInfo {
    id: number;
    phone_number: string;
    addition_time: string;
    service_name: string;
    call_start_time: string;
    has_status_realised?: boolean;
}

interface Callback24CallInfo {
    callAtData: string;
    callAtTime: string;
    utmSource: string;
    utmCampaign: string | null;
}


export type {
  Callback24ClientInfo,
  Callback24CallInfo,
};

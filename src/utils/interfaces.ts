import {Timestamp} from "firebase/firestore";

interface ErrorData {
    isError: boolean;
    isSendEmail: boolean;
    errorTime: null | Timestamp;
}


export type {ErrorData};

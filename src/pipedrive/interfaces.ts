interface ServiceData {
    id: string | number;
    phone: string;
    // стоит ли убрать any ?
    [key: string]: any;
}


export type {
  ServiceData,
};

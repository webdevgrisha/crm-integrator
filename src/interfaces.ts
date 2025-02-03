interface ProcessedLeadInfo {
    serviceLeadId: string | number,
    createdPersonId: number | null,
    createdLeadId: string | null,
    dateFrom: FirebaseFirestore.Timestamp,
}


export type {ProcessedLeadInfo};

// Visibility groups for leads/persons
// https://support.pipedrive.com/en/article/visibility-groups-for-leads

enum VisibilityGroup {
  OwnerAndFollowers = "1",
  EntireCompany = "3"
}

enum Currency {
  PLN = "PLN",
  EUR = "EUR",
  USD = "USD"
}

enum PersonFieldKeys {
  Day = "e6dff719149bfa7e1abf099147a884ce034a30cf",
  Hour = "f23f6eeb8739812fbdd2077d855491c0bf61a2f8",
  CallStatus = "09989d2fec8cf30575796146f296aed9674b275c",
}

enum LeadFieldKeys {
  Car = "a967acb031cf9a8aa315a9a8f636f17df69834a2",
  CarDescription = "06582203cc7a080dc7ce10a20cb8ca88c38b1ac3",
  UtmCampaign = "b8cbdbb7fb67e767ff1bf9c0799b2311e2851c34",
  UtmTerm = "7cbbe1273416770e7d9d09f460fcb66c138adc99",
}


export {
  VisibilityGroup,
  Currency,
  PersonFieldKeys,
  LeadFieldKeys,
};

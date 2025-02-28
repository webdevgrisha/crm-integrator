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

enum PersonCustomFields {
  Day = 28,
  Hour = 27,
  CallStatus = 29,
}

enum LeadCustomFields {
  Car = 41,
  CarDescription = 43,
  UtmCampaign = 40,
}


export {
  VisibilityGroup,
  Currency,
  PersonCustomFields,
  LeadCustomFields,
};

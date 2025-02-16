// create persons API Docs
// https://developers.pipedrive.com/docs/api/v1/Persons

import {CustomFields, VisibilityGroup} from "./types";

interface PersonConfig {
    visible_to: VisibilityGroup,
    customFields: CustomFields,
}

const personCustomFields: CustomFields = {
  personDayField: 28,
  personHourField: 27,
  callStatusField: 29,
};

const personConfig: PersonConfig = {
  visible_to: "1",
  customFields: personCustomFields,
};


export {
  personConfig,
};

export type {
  PersonConfig,
};

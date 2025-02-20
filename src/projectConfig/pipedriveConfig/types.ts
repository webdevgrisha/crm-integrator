// Visibility groups for leads/persons
// https://support.pipedrive.com/en/article/visibility-groups-for-leads

// 1 Owner & followers
// 3 Entire company
type VisibilityGroup = "1" | "3";

type CustomFields = Record<string, number>;


export type {
  VisibilityGroup,
  CustomFields,
};

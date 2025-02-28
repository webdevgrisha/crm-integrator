import {gmailConfig} from "../../projectConfig";

type DoubleCriteria = [string, string];
type TripleCriteria = [string, string, string];
type NestedCriteria = [string, TripleCriteria, TripleCriteria | NestedCriteria];
type SearchCriteria = (
  string | DoubleCriteria | TripleCriteria | NestedCriteria
)[];

function createSearchCriteria(formattedDate: string): SearchCriteria {
  const titleArr = gmailConfig.filterMailTitles;

  if (titleArr.length === 0) {
    return ["ALL", ["SINCE", formattedDate]];
  }

  let criteria: TripleCriteria | NestedCriteria =
    ["HEADER", "SUBJECT", titleArr[0]];

  for (let i = 1; i < titleArr.length; i++) {
    criteria = ["OR", ["HEADER", "SUBJECT", titleArr[i]], criteria];
  }

  return ["ALL", ["SINCE", formattedDate], criteria];
}

export {
  createSearchCriteria,
};

export type {
  SearchCriteria,
};

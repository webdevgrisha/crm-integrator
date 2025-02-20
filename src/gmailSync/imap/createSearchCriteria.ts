import {gmailConfig} from "../../projectConfig";

function createSearchCriteria(formattedDate: string) {
  const titleArr = gmailConfig.filterMailTitles;

  if (titleArr.length === 0) {
    return ["ALL", ["SINCE", formattedDate]];
  }

  let criteria: any = ["HEADER", "SUBJECT", titleArr[0]];

  for (let i = 1; i < titleArr.length; i++) {
    criteria = ["OR", ["HEADER", "SUBJECT", titleArr[i]], criteria];
  }

  return ["ALL", ["SINCE", formattedDate], criteria];
}

export {
  createSearchCriteria,
};

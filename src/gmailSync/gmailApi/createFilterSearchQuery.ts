import {gmailConfig} from "../../projectConfig";

type SearchQueryStr = string;

function createFilterSearchQuery(
  dateFrom: number,
  dateTo: number
): SearchQueryStr {
  const subjectQuery = `
        subject: ${gmailConfig.filterMailTitles.join(" OR subject: ")}
        after:${dateFrom} before:${dateTo}`;

  return subjectQuery;
}

export {
  createFilterSearchQuery,
};

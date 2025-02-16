import {gmailConfig} from "../../projectConfig";

function createFilterSearchQuery(dateFrom: number, dateTo: number) {
  const subjectQuery = `
        subject: ${gmailConfig.filterMailTitles.join(" OR subject: ")}
        after:${dateFrom} before:${dateTo}`;

  return subjectQuery;
}

export {
  createFilterSearchQuery,
};

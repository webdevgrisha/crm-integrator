import {format} from "date-fns";

type DateStr = string

function formatTimestampToDate(timestamp: number): DateStr {
  const date = new Date(timestamp);
  return format(date, "dd-MMM-yyyy");
}


export {
  formatTimestampToDate,
};

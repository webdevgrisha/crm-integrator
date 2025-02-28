import {getCallInfo} from "./getCallInfo";
import {getHistory} from "./getHistory";
import {Callback24ProcessData} from "./interfaces";


async function handleCallback24Data(
  dateFrom: string,
  dateTo: string
): Promise<Callback24ProcessData[]> {
  const callInfoArr = await getHistory(dateFrom, dateTo);

  if (!callInfoArr) {
    throw new Error("Failed to fetch call history: No data returned.");
  }

  const additionCallInfo = await Promise.all(
    callInfoArr.map((callInfo) => getCallInfo(callInfo.id))
  );

  const unitData: Callback24ProcessData[] = callInfoArr.map(
    (callInfo, index) => (
      {
        ...callInfo,
        ...additionCallInfo[index],
      }
    ));

  return unitData;
}


export {handleCallback24Data};

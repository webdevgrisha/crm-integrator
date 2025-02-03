import {getCallInfo} from "./getCallInfo";
import {getHistory} from "./getHistory";

// стоит ли тут добавить обработку ошибок?
async function handleCallback24Data(dateFrom: string, dateTo: string) {
  const callInfoArr = await getHistory(dateFrom, dateTo);

  if (!callInfoArr) {
    throw new Error("Failed to fetch call history: No data returned.");
  }

  const additionCallInfo = await Promise.all(
    callInfoArr.map((callInfo) => getCallInfo(callInfo.id))
  );

  const unitData = callInfoArr.map((callInfo, index) => ({
    ...callInfo,
    ...additionCallInfo[index],
  }));

  return unitData;
}


export {handleCallback24Data};

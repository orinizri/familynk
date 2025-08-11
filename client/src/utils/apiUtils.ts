import { apiStatus } from "../constants/apiStatus";
import { apiStatesType, statusesType } from "../types/api.types";

export const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);


export function prepareStatuses(currentStatus: apiStatesType): statusesType {
  const statuses = {};
  for (const status of Object.values(apiStatus)) {
    const capitalized = capitalize(status);
    const statusesKey = `is${capitalized}`;
    statuses[statusesKey] = status === currentStatus;
  }
  return statuses as statusesType;
}



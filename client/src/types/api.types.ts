import { apiStatus } from "@client/constants/apiStatus";

export type statusesType = {
  isIdle: boolean;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  isPending: boolean;
};

export type apiStatesType = keyof typeof apiStatus;

export type apiStatusFieldType = (typeof apiStatus)[keyof typeof apiStatus];

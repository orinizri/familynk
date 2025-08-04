import React, { useMemo, useState } from "react";
import { apiStatus } from "../../constants/apiStatus";
import { apiStatesType, prepareStatuses } from "../../utils/apiUtils";
import { statusesType } from "@client/types/api.types";

function useApiStatus(currentStatus = apiStatus.IDLE): {
  status: apiStatesType;
  setStatus: React.Dispatch<React.SetStateAction<string>>;
  statuses: statusesType;
} {
  const [status, setStatus] = useState(currentStatus as apiStatesType);
  const statuses = useMemo(() => prepareStatuses(status), [status]);

  return {
    status,
    setStatus,
    statuses,
  };
}

export default useApiStatus;

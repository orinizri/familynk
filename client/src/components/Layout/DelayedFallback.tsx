import React, { useState, useEffect } from "react";
import Spinner from "../Spinner/Spinner";

interface Props {
  delay?: number; // ms
  shouldShow?: boolean;
  message?: string;
}

export default function DelayedFallback(props: Props) {
  const { delay = 400, shouldShow = true, message = "Loading" } = props;
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    if (!shouldShow) {
      setShowLoader(false);
      return;
    }
    if (delay <= 0) {
      setShowLoader(true);
      return;
    }

    const timeout = setTimeout(() => setShowLoader(true), delay);
    return () => clearInterval(timeout); // clean up on unmount
  }, [delay, shouldShow]);

  return showLoader ? <Spinner message={message} /> : null;
}

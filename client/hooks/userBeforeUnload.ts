import { useState, useEffect } from "react";
import Router from "next/router";

export const useBeforeUnload = () => {
  const [isValidSession, setIsValidSession] = useState<boolean>(false);

  const warningText =
    "You have unsaved changes - are you sure you wish to leave this page?";

  useEffect(() => {
    const handleWindowClose = (e: any) => {
      if (!isValidSession) return;
      e.preventDefault();
      return (e.returnValue = warningText);
    };
    const handleBrowseAway = (url: any) => {
      const params = new URLSearchParams(url);
      const onClosedSessionId = params.get("/?onClosedSession");
      if (onClosedSessionId) return;
      if (!isValidSession) return;
      if (window.confirm(warningText)) return;
      Router.events.emit("routeChangeError");
      throw "routeChange aborted.";
    };
    window.addEventListener("beforeunload", handleWindowClose);
    Router.events.on("routeChangeStart", handleBrowseAway);
    return () => {
      window.removeEventListener("beforeunload", handleWindowClose);
      Router.events.off("routeChangeStart", handleBrowseAway);
    };
  }, [isValidSession]);

  return { isValidSession, setIsValidSession };
};

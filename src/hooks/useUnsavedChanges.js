import { useCallback, useEffect, useRef } from "react";
import { unstable_useBlocker as useBlocker } from "react-router-dom";
import { store } from "../redux/store";

export const useUnsavedChanges = (dirty) => {
  const allowRef = useRef(false);

  const shouldBlock = useCallback(
    ({ currentLocation, nextLocation }) =>
      dirty &&
      !allowRef.current &&
      !!store.getState().auth?.token &&
      currentLocation.pathname !== nextLocation.pathname,
    [dirty]
  );
  const blocker = useBlocker(shouldBlock);

  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (e) => {
      if (allowRef.current) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  const allowNavigation = useCallback(() => {
    allowRef.current = true;
  }, []);

  return { blocker, allowNavigation };
};

import { useEffect } from "react";

export const useEventListener = (
  eventName: keyof WindowEventMap,
  eventListener: () => void
) => {
  useEffect(() => {
    window.addEventListener(eventName, eventListener);

    return () => {
      window.removeEventListener(eventName, eventListener);
    };
  }, [eventName, eventListener]);
};

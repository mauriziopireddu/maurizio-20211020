import { useEffect } from "react";

export const useEventListener = <T extends HTMLElement = HTMLDivElement>(
  eventName: keyof WindowEventMap,
  eventListener: (event: Event) => void
) => {
  useEffect(() => {
    window.addEventListener(eventName, eventListener);

    return () => {
      window.removeEventListener(eventName, eventListener);
    };
  }, [eventName, eventListener]);
};

import { useEffect, useState } from "react";

export const usePageVisibility = () => {
  const [isPageVisible, setIsPageVisible] = useState(true);
  useEffect(() => {
    const handler = () => {
      setIsPageVisible((state) => !state);
    };

    window.addEventListener("visibilitychange", handler);

    return () => {
      window.removeEventListener("visibilitychange", handler);
    };
  }, []);

  return isPageVisible;
};

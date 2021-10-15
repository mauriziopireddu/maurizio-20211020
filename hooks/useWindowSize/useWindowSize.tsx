import { useEffect, useState } from "react";

interface WindowSize {
  width: number;
  height: number;
  isMobile: boolean;
}

const breakpoint = 640;

export const useWindowSize = (): WindowSize => {
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
    isMobile: true,
  });

  useEffect(() => {
    const handler = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
        isMobile: window.innerWidth <= breakpoint,
      });
    };

    handler();

    window.addEventListener("resize", handler);

    return () => {
      window.removeEventListener("resize", handler);
    };
  }, []);

  return windowSize;
};

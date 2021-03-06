import { useEffect, useState } from "react";

type WindowSize = {
  width: number;
  height: number;
  isMobile: boolean;
};

const breakpoint = 640;

export const useWindowSize = (): WindowSize => {
  const [windowSize, setWindowSize] = useState({
    width: 1600,
    height: 873,
    isMobile: false,
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

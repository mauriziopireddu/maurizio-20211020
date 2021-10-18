import { useEffect, useRef } from "react";

export type DevicePerformance = "low" | "medium" | "high";

export const useDevicePerformance = (): DevicePerformance => {
  const devicePerformance = useRef<DevicePerformance>("medium");

  useEffect(() => {
    // @ts-ignore
    const ram = navigator?.deviceMemory ?? 4;
    const cpu = navigator?.hardwareConcurrency ?? 2;

    if (ram > 4 && cpu > 2) {
      devicePerformance.current = "high";
    } else if (cpu === 1 && ram <= 2) {
      devicePerformance.current = "low";
    } else {
      devicePerformance.current = "medium";
    }
  }, []);

  return devicePerformance.current;
};

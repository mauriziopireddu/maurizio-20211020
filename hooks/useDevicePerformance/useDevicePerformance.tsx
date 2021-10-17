export type DevicePerformance = "low" | "medium" | "high";

export const useDevicePerformance = (): DevicePerformance => {
  // @ts-ignore
  const ram = navigator.deviceMemory ?? 4;
  const cpu = navigator.hardwareConcurrency ?? 2;

  if (ram > 4 && cpu > 2) {
    return "high";
  }

  if (cpu === 1 && ram <= 2) {
    return "low";
  }

  return "medium";
};

import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export const Overlay = ({ children }: Props) => {
  return (
    <div className="flex flex-col space-y-4 min-w-screen h-screen fixed left-0 top-0 bg-opacity-90 justify-center items-center inset-0 bg-gray-900 z-50">
      {children}
    </div>
  );
};

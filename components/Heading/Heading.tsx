import { ReactNode } from "react";

type Props = {
  children: ReactNode | string;
};

export const Heading = ({ children }: Props) => {
  return (
    <header className="p-4 flex">
      <h1>Order Book</h1>
      {children}
    </header>
  );
};

import { Spread } from "components/Spread";
import { useWindowSize } from "hooks/useWindowSize";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export const Heading = ({ children }: Props) => {
  const { isMobile } = useWindowSize();
  return (
    <header className="p-4 flex">
      <h1>Order Book</h1>
      {children}
    </header>
  );
};

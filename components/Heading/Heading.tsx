import { Spread } from "components/Spread";
import { useWindowSize } from "hooks";

export const Heading = () => {
  const { isMobile } = useWindowSize();
  return (
    <header className="p-4 flex">
      <h1>Order Book</h1>
      {!isMobile && <Spread />}
    </header>
  );
};

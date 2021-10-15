import type { NextPage } from "next";
import { Heading } from "components/Heading";
import { OrderTable } from "components/OrderTable";
import { useWindowSize } from "hooks";
import { Spread } from "components/Spread";

const Home: NextPage = () => {
  const { isMobile } = useWindowSize();
  return (
    <>
      <Heading />
      <hr className="border-gray-700" />
      <main className={isMobile ? "inline" : "flex"}>
        <OrderTable
          type="bid"
          customColumnsOrder={["total", "size", "price"]}
          direction={isMobile ? "to right" : "to left"}
        />
        {isMobile && <Spread />}
        <OrderTable type="ask" showHeading={!isMobile} direction="to right" />
      </main>
      <footer></footer>
    </>
  );
};

export default Home;

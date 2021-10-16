import type { NextPage } from "next";
import { Heading } from "components/Heading";
import { OrderTable } from "components/OrderTable";
import { useWindowSize } from "hooks/useWindowSize";
import { Spread } from "components/Spread";
import { ToggleFeed } from "components/ToggleFeed";
import { useCryptoFacilities } from "hooks/useCryptoFacilities";

const Home: NextPage = () => {
  const { isMobile } = useWindowSize();
  const { closeConnection, reopenConnection, book } = useCryptoFacilities();

  const BidTable = (
    <OrderTable
      type="bid"
      customColumnsOrder={["total", "size", "price"]}
      direction={isMobile ? "to right" : "to left"}
      showHeading={!isMobile}
      orders={book.bids}
    />
  );

  const AskTable = (
    <OrderTable
      type="ask"
      direction="to right"
      orders={book.asks}
      reverse={isMobile}
    />
  );

  return (
    <>
      {/* <button type="button" onClick={() => closeConnection()}>
        closeConnection
      </button>
      <button type="button" onClick={() => reopenConnection()}>
        reconnect
      </button> */}
      <Heading>{!isMobile && <Spread book={book} />}</Heading>
      <hr className="border-gray-700" />
      <main className={isMobile ? "inline" : "flex"}>
        {!isMobile ? (
          <>
            {BidTable}
            {AskTable}
          </>
        ) : (
          <>
            {AskTable}
            <Spread book={book} />
            {BidTable}
          </>
        )}
      </main>
      <footer className="flex my-4">
        <ToggleFeed />
      </footer>
    </>
  );
};

export default Home;

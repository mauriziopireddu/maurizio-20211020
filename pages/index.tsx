import type { NextPage } from "next";
import { Heading } from "components/Heading";
import { OrderTable } from "components/OrderTable";
import { useWindowSize } from "hooks/useWindowSize";
import { Spread } from "components/Spread";
import { ToggleFeed } from "components/ToggleFeed";
import { useCryptoFacilities } from "hooks/useCryptoFacilities";

const Home: NextPage = () => {
  const { isMobile } = useWindowSize();
  const limit = isMobile ? 12 : 16;
  const { closeConnection, reopenConnection, book } = useCryptoFacilities();

  const BidTable = (
    <OrderTable
      type="bid"
      customColumnsOrder={["total", "size", "price"]}
      depthDirection={isMobile ? "to right" : "to left"}
      showHeading={!isMobile}
      orders={book.bids.slice(0, limit)}
    />
  );

  const AskTable = (
    <OrderTable
      type="ask"
      depthDirection="to right"
      orders={book.asks.slice(0, limit)}
      reverse={isMobile}
    />
  );

  return (
    <>
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
      <button type="button" onClick={() => closeConnection()}>
        closeConnection
      </button>
      <button type="button" onClick={() => reopenConnection()}>
        reconnect
      </button>
    </>
  );
};

export default Home;

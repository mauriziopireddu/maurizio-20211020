import type { NextPage } from "next";
import { Heading } from "components/Heading";
import { OrderTable } from "components/OrderTable";
import { useWindowSize } from "hooks/useWindowSize";
import { Spread } from "components/Spread";
import { useCryptoFacilities } from "hooks/useCryptoFacilities";
import { Modal } from "components/Modal";
import { Button } from "components/Button";
import { usePageVisibility } from "hooks/usePageVisibility";
import { useEffect } from "react";

const Home: NextPage = () => {
  const { isMobile } = useWindowSize();
  const isPageVisible = usePageVisibility();

  useEffect(() => {
    if (!isPageVisible && isConnected) {
      closeConnection();
    }
  }, [isPageVisible]);

  const { closeConnection, reconnect, book, changeContract, isConnected } =
    useCryptoFacilities();

  const limit = isMobile ? 12 : 16;

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
      {!isConnected && <Modal onClick={reconnect} />}
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
        <Button onClick={changeContract}>Toggle Feed</Button>
      </footer>
    </>
  );
};

export default Home;

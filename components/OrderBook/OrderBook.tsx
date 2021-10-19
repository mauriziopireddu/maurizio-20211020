import { Heading } from "components/Heading";
import { OrderTable, Props as OrderTableProps } from "components/OrderTable";
import { Spread } from "components/Spread";
import { Modal } from "components/Modal";
import { Button } from "components/Button";
import { useCryptoFacilities } from "hooks/useCryptoFacilities";
import { useEventListener } from "hooks/useEventListener";
import { useWindowSize } from "hooks/useWindowSize";

export const OrderBook = () => {
  const { book, events: sockEvents, isConnected } = useCryptoFacilities();
  useEventListener("blur", () => sockEvents.closeConnection());
  const { isMobile } = useWindowSize();

  const limit = isMobile ? 12 : 16;
  const bids = book.bids.slice(0, limit);
  const asks = book.asks.slice(0, limit);

  const bidsTable: OrderTableProps = {
    orders: bids,
    customColumnsOrder: ["total", "size", "price"],
    depthDirection: isMobile ? "right" : "left",
    showHeading: !isMobile,
    isMobile,
    priceColor: "green-600",
    depthColor: "rgba(0,132,100,.3)",
  };

  const asksTable: OrderTableProps = {
    orders: asks,
    depthDirection: "right",
    isMobile: isMobile,
    priceColor: "red-600",
    depthColor: "rgba(160,55,55,.3)",
    reverse: isMobile,
  };

  return (
    <>
      {!isConnected && <Modal onClick={sockEvents.reconnect} />}
      <Heading>{!isMobile && <Spread book={book} />}</Heading>
      <hr className="border-gray-700" />
      <main className={isMobile ? "inline" : "flex"}>
        {!isMobile ? (
          <>
            <OrderTable {...bidsTable} />
            <OrderTable {...asksTable} />
          </>
        ) : (
          <>
            <OrderTable {...asksTable} />
            <Spread className="my-2" book={book} />
            <OrderTable {...bidsTable} />
          </>
        )}
      </main>
      <footer className="flex my-4">
        <Button onClick={sockEvents.changeContract}>Toggle Feed</Button>
      </footer>
    </>
  );
};

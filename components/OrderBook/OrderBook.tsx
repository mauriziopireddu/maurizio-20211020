import { Heading } from "components/Heading";
import { OrderTable, Props as OrderTableProps } from "components/OrderTable";
import { useWindowSize } from "hooks/useWindowSize";
import { Spread } from "components/Spread";
import { useCryptoFacilities } from "hooks/useCryptoFacilities";
import { Modal } from "components/Modal";
import { Button } from "components/Button";
import { useEventListener } from "hooks/useEventListener";

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
    depthDirection: isMobile ? "to right" : "to left",
    showHeading: !isMobile,
    isMobile,
    priceColor: "green-600",
    depthColor: "#123534",
  };

  const asksTable: OrderTableProps = {
    orders: asks,
    depthDirection: "to right",
    isMobile: isMobile,
    priceColor: "red-600",
    depthColor: "#3D1E28",
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
            <Spread book={book} />
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

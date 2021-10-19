import { Book } from "types";
import { SpreadMessage } from "./SpreadMessage";

type Props = {
  book: Book;
  className?: string;
};

export const Spread = ({ book, className = "" }: Props) => {
  const lowestAsk = book.asks[0]?.price;
  const highestBid = book.bids[0]?.price;

  if (!book.asks.length && !book.bids.length) {
    return <SpreadMessage className={className}>Spread: N/A</SpreadMessage>;
  }

  if (!book.asks.length) {
    return (
      <SpreadMessage className={className}>No asks available</SpreadMessage>
    );
  }

  if (!book.bids.length) {
    return (
      <SpreadMessage className={className}>No bids available</SpreadMessage>
    );
  }

  const spreadValue = lowestAsk - highestBid;
  const percentageValue = lowestAsk > 0 ? (spreadValue / lowestAsk) * 100 : 0;

  const spread = spreadValue.toLocaleString(undefined, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

  const percentage = percentageValue.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <SpreadMessage
      className={className}
    >{`Spread: ${spread} (${percentage}%)`}</SpreadMessage>
  );
};

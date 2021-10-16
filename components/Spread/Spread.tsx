import { Book } from "types";
import { SpreadWarningMessage } from "./SpreadWarningMessage";

type Props = {
  book: Book;
};

export const Spread = ({ book }: Props) => {
  const lowestAsk = book.asks[0]?.price;
  const highestBid = book.bids[0]?.price;

  if (!book.asks.length) {
    return <SpreadWarningMessage>No asks available</SpreadWarningMessage>;
  }

  if (!book.bids.length) {
    return <SpreadWarningMessage>No bids available</SpreadWarningMessage>;
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
    <p className="m-auto text-secondary text-center">
      Spread: {spread} ({percentage}%)
    </p>
  );
};

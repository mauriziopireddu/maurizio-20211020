import { Book, Order, ProductId } from "types";
export type Feed = "book_ui_1_snapshot" | "book_ui_1";

export type MessageData = {
  numLevels: number;
  feed: Feed;
  bids: [[number, number]];
  asks: [[number, number]];
  product_id: ProductId;
};

const getFormattedOrder = (rawOrder: [[number, number]]): Order[] => {
  let previousTotal = 0;
  return rawOrder.map(([price, size]) => {
    const formattedOrder = { size, price, total: size + previousTotal };
    previousTotal += size;
    return formattedOrder;
  });
};

export const createBook = (data: MessageData): Book => {
  const bids = getFormattedOrder(data.bids);
  const asks = getFormattedOrder(data.asks);
  const book: Book = { bids, asks };

  return book;
};

import { Book, Order, ProductId } from "types";
export type Feed = "book_ui_1_snapshot" | "book_ui_1";

export type MessageData = {
  numLevels: number;
  feed: Feed;
  bids: [[number, number]];
  asks: [[number, number]];
  product_id: ProductId;
  event?:
    | "subscribed"
    | "subscribed_failed"
    | "unsubscribed"
    | "unsubscribed_failed";
};

const getFormattedOrders = (rawOrders: [[number, number]]): Order[] => {
  return rawOrders.map(([price, size]) => {
    return { size, price, total: 0 };
  });
};

const calculateTotal = (orders: Order[]): Order[] => {
  let previousTotal = 0;
  return orders.map(({ size, price }) => {
    const formattedOrder = { size, price, total: size + previousTotal };
    previousTotal += size;
    return formattedOrder;
  });
};

export const createBook = (data: MessageData): Book => {
  const bids = calculateTotal(getFormattedOrders(data.bids));
  const asks = calculateTotal(getFormattedOrders(data.asks));
  const book: Book = { bids, asks };

  return book;
};

const updateOrders = (
  orders: Order[],
  delta: [[number, number]],
  sort: "asc" | "desc"
): Order[] => {
  let shouldSort = false;
  delta.map(([price, newSize]) => {
    const index = orders.findIndex((order) => order.price === price);
    const orderNotFound = index === -1;
    if (orderNotFound && newSize > 0) {
      orders.push({ price, size: newSize, total: 0 });
      shouldSort = true;
      return;
    }
    if (newSize === 0) {
      orders.splice(index, 1);
      return;
    }
    orders[index] = { price, size: newSize, total: 0 };
  });

  if (shouldSort) {
    orders.sort((a, b) =>
      sort === "asc" ? a.price - b.price : b.price - a.price
    );
  }
  return orders;
};

export const updateBook = (book: Book, delta: MessageData): Book => {
  const bids = updateOrders([...book.bids], [...delta.bids], "desc");
  const asks = updateOrders([...book.asks], [...delta.asks], "asc");

  const newBids = calculateTotal(bids);
  const newAsks = calculateTotal(asks);

  return { asks: newAsks, bids: newBids };
};

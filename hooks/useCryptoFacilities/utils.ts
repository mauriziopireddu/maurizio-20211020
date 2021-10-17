import { Book, Order } from "types";
import { MessageData, Queue, Queues } from "./types";

const getFormattedOrders = (rawOrders: [number, number][]): Order[] => {
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

  return { bids, asks };
};

const updateOrders = (
  orders: Order[],
  queue: Queue,
  sort: "asc" | "desc"
): Order[] => {
  let shouldSort = false;
  Object.entries(queue).map(([key, newSize]) => {
    const price = +key;
    const index = orders.findIndex((order) => order.price === price);
    const orderNotFound = index === -1;
    if (orderNotFound) {
      if (newSize > 0) {
        orders.push({ price, size: newSize, total: 0 });
        shouldSort = true;
      }
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

const updateQueue = (queue: Queue, update: [number, number][]): Queue => {
  update.map(([price, newSize]) => (queue[price] = newSize));
  return queue;
};

export const updateQueues = (queue: Queues, updates: MessageData): Queues => {
  const asks = updateQueue({ ...queue.asks }, updates.asks);
  const bids = updateQueue({ ...queue.bids }, updates.bids);
  return { asks, bids };
};

export const processQueues = (book: Book, queue: Queues): Book => {
  const bids = updateOrders([...book.bids], { ...queue.bids }, "desc");
  const asks = updateOrders([...book.asks], { ...queue.asks }, "asc");

  const bidsWithTotal = calculateTotal(bids);
  const asksWithTotal = calculateTotal(asks);

  return { asks: asksWithTotal, bids: bidsWithTotal };
};

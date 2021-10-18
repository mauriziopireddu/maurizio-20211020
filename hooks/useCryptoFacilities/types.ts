import { Book, ProductId } from "types";

export type Feed = "book_ui_1_snapshot" | "book_ui_1";

export type MessageData = {
  numLevels: number;
  feed: Feed;
  bids: [number, number][];
  asks: [number, number][];
  product_id: ProductId;
  event?:
    | "subscribed"
    | "subscribed_failed"
    | "unsubscribed"
    | "unsubscribed_failed";
};

export type Queue = Record<number, number>;

export type Queues = {
  asks: Queue;
  bids: Queue;
};

export type CryptoFacilities = {
  events: {
    closeConnection: () => void;
    reconnect: () => void;
    changeContract: () => void;
  };
  book: Book;
  isConnected: boolean;
};

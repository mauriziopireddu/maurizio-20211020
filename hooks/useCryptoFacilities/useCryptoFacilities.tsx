import { useState } from "react";
import useWebSocket from "react-use-websocket";
import { Book } from "types";
import { createBook, MessageData } from "./utils";
const cryptoFacilitiesEndpoint = "wss://www.cryptofacilities.com/ws/v1";

type CryptoFacilities = {
  error: boolean;
  closeConnection: () => void;
  reopenConnection: () => void;
  book: Book;
};

type ProductId = "PI_XBTUSD" | "PI_ETHUSD";

export const useCryptoFacilities = (): CryptoFacilities => {
  const [error, setError] = useState(false);
  const [connected, setConnected] = useState(true);
  const [book, setBook] = useState<Book>({
    bids: [],
    asks: [],
  });

  const { sendJsonMessage } = useWebSocket(
    cryptoFacilitiesEndpoint,
    {
      onOpen: () => {
        sendJsonMessage({
          event: "subscribe",
          feed: "book_ui_1",
          product_ids: ["PI_XBTUSD"],
        });
      },
      onClose: () => {
        console.log("Connection closed");
      },
      onError: () => {
        setError(true);
      },
      onMessage: (message) => {
        const data: MessageData = JSON.parse(message.data);
        if (data.feed === "book_ui_1_snapshot") {
          setBook(createBook(data));
        } else if (data.feed === "book_ui_1") {
        }
      },
      filter: (message) => {
        return true;
      },
    },
    connected
  );

  const changeContract = (productId: ProductId) => {};
  const closeConnection = () => setConnected(false);
  const reopenConnection = () => setConnected(true);

  return { error, closeConnection, reopenConnection, book };
};

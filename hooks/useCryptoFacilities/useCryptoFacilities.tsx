import { refreshRate } from "config";
import { useDevicePerformance } from "hooks/useDevicePerformance";
import { useInterval } from "hooks/useInterval";
import { useRef, useState } from "react";
import useWebSocket from "react-use-websocket";
import { Book } from "types";
import { createBook, MessageData, updateBook } from "./utils";
const cryptoFacilitiesEndpoint = "wss://www.cryptofacilities.com/ws/v1";

type CryptoFacilities = {
  error: boolean;
  closeConnection: () => void;
  reconnect: () => void;
  changeContract: () => void;
  book: Book;
  isConnected: boolean;
};

type ProductId = "PI_XBTUSD" | "PI_ETHUSD";

export const useCryptoFacilities = (): CryptoFacilities => {
  const productRef = useRef<ProductId>("PI_XBTUSD");
  const [error, setError] = useState(false);
  const [connected, setConnected] = useState(true);
  const [book, setBook] = useState<Book>({ bids: [], asks: [] });
  const batchedBook = useRef<Book>({ bids: [], asks: [] });

  const { sendJsonMessage } = useWebSocket(
    cryptoFacilitiesEndpoint,
    {
      onOpen: () => {
        sendJsonMessage({
          event: "subscribe",
          feed: "book_ui_1",
          product_ids: [productRef.current],
        });
      },
      onError: () => {
        setError(true);
      },
      onMessage: (message) => {
        const data: MessageData = JSON.parse(message.data);
        if (data.event) {
          return;
        }
        if (data.feed === "book_ui_1_snapshot") {
          setBook(createBook(data));
          return;
        }
        if (data.feed === "book_ui_1") {
          batchedBook.current = updateBook(batchedBook.current, data);
          return;
        }
      },
    },
    connected
  );

  const performance = useDevicePerformance();
  useInterval(() => setBook(batchedBook.current), refreshRate[performance]);

  const changeContract = () => {
    const newProductId: ProductId =
      productRef.current === "PI_XBTUSD" ? "PI_ETHUSD" : "PI_XBTUSD";

    sendJsonMessage({
      event: "unsubscribe",
      feed: "book_ui_1",
      product_ids: [productRef.current],
    });

    sendJsonMessage({
      event: "subscribe",
      feed: "book_ui_1",
      product_ids: [newProductId],
    });

    productRef.current = newProductId;
  };

  const closeConnection = () => {
    if (connected) {
      setConnected(false);
    }
  };

  const reconnect = () => {
    if (!connected) {
      setConnected(true);
    }
  };

  return {
    error,
    closeConnection,
    reconnect,
    book,
    changeContract,
    isConnected: connected,
  };
};

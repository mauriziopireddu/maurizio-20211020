import { refreshRate } from "config";
import { useDevicePerformance } from "hooks/useDevicePerformance";
import throttle from "lodash/throttle";
import { useMemo, useRef, useState } from "react";
import useWebSocket from "react-use-websocket";
import { Book, ProductId } from "types";
import { CryptoFacilities, MessageData, Queues } from "./types";
import { createBook, processQueues, updateQueues } from "./utils";

const cryptoFacilitiesEndpoint = "wss://www.cryptofacilities.com/ws/v1";

const emptyQueues = { asks: {}, bids: {} };
const emptyBook = { bids: [], asks: [] };

export const useCryptoFacilities = (): CryptoFacilities => {
  const productRef = useRef<ProductId>("PI_XBTUSD");
  const [connected, setConnected] = useState(true);
  const [book, setBook] = useState<Book>(emptyBook);
  const performance = useDevicePerformance();
  const deltaQueues = useRef<Queues>({ bids: {}, asks: {} });

  const updateBook = useMemo(
    () =>
      throttle(() => {
        const newBook = processQueues(book, deltaQueues.current);
        setBook(newBook);
        deltaQueues.current = emptyQueues;
      }, refreshRate[performance]),
    [performance]
  );

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
          deltaQueues.current = updateQueues(deltaQueues.current, data);
          updateBook();
          return;
        }
      },
    },
    connected
  );

  const changeContract = () => {
    const newProductId: ProductId =
      productRef.current === "PI_XBTUSD" ? "PI_ETHUSD" : "PI_XBTUSD";

    sendJsonMessage({
      event: "unsubscribe",
      feed: "book_ui_1",
      product_ids: [productRef.current],
    });

    deltaQueues.current = emptyQueues;
    setBook(emptyBook);

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
    book,
    isConnected: connected,
    events: {
      closeConnection,
      reconnect,
      changeContract,
    },
  };
};

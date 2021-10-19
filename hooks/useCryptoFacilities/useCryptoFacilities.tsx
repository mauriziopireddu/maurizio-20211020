import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useMemo,
  useRef,
  useState,
} from "react";
import { DebouncedFunc } from "lodash";
import throttle from "lodash/throttle";
import useWebSocket from "react-use-websocket";
import { refreshRate } from "config";
import { Book, ProductId } from "types";
import { useDevicePerformance } from "hooks/useDevicePerformance";
import { CryptoFacilities, MessageData, Queues } from "./types";
import { createBook, processQueues, updateQueues } from "./utils";

const cryptoFacilitiesEndpoint = "wss://www.cryptofacilities.com/ws/v1";

const emptyQueues = { asks: {}, bids: {} };

export const onMessage =
  (
    deltaQueues: MutableRefObject<Queues>,
    setBook: Dispatch<SetStateAction<Book>>,
    updateBook: DebouncedFunc<() => void>
  ) =>
  (message: MessageEvent) => {
    const data: MessageData = JSON.parse(message.data);
    if (data.event) {
      return;
    }
    if (data.feed === "book_ui_1_snapshot") {
      deltaQueues.current = emptyQueues;
      setBook(createBook(data));
      return;
    }
    if (data.feed === "book_ui_1") {
      deltaQueues.current = updateQueues(deltaQueues.current, data);
      updateBook();
      return;
    }
  };

export const useCryptoFacilities = (): CryptoFacilities => {
  const productRef = useRef<ProductId>("PI_XBTUSD");
  const [connected, setConnected] = useState(true);
  const [book, setBook] = useState<Book>({ bids: [], asks: [] });
  const performance = useDevicePerformance();
  const deltaQueues = useRef<Queues>({ bids: {}, asks: {} });

  const updateBook = useMemo(
    () =>
      throttle(() => {
        setBook((oldBook) => processQueues(oldBook, deltaQueues.current));
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
      onMessage: onMessage(deltaQueues, setBook, updateBook),
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

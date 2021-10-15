import { useState } from "react";
import useWebSocket from "react-use-websocket";
const cryptoFacilitiesEndpoint = "wss://www.cryptofacilities.com/ws/v1";

type CryptoFacilities = {
  error: boolean;
  closeConnection: () => void;
  reopenConnection: () => void;
};

type ProductId = "PI_XBTUSD" | "PI_ETHUSD";

export const useCryptoFacilities = (): CryptoFacilities => {
  const [error, setError] = useState(false);
  const [connected, setConnected] = useState(true);

  const ws = useWebSocket(
    cryptoFacilitiesEndpoint,
    {
      onOpen: () => {
        ws.sendJsonMessage({
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
        console.log(message);
      },
    },
    connected
  );

  const changeContract = (productId: ProductId) => {};
  const closeConnection = () => setConnected(false);
  const reopenConnection = () => setConnected(true);

  return { error, closeConnection, reopenConnection };
};

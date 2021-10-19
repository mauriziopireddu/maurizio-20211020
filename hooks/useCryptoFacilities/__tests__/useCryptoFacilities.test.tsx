import { act, renderHook } from "@testing-library/react-hooks";
import { debounce } from "lodash";
import {
  onMessage as onMessageWrapper,
  useCryptoFacilities,
} from "../useCryptoFacilities";

const mockSendJsonMessage = jest.fn();

jest.mock("react-use-websocket", () => {
  return jest.fn(() => ({
    sendJsonMessage: mockSendJsonMessage,
  }));
});

describe("useCryptoFacilities", () => {
  it("has a default state", () => {
    const { result } = renderHook(() => useCryptoFacilities());
    const data = result.current;
    expect(data.book).toEqual({ bids: [], asks: [] });
    expect(data.isConnected).toEqual(true);
    const { events } = data;
    expect(typeof events.changeContract).toBe("function");
    expect(typeof events.reconnect).toBe("function");
    expect(typeof events.closeConnection).toBe("function");
  });

  it("closes and reopens the connection successfully", () => {
    const { result } = renderHook(() => useCryptoFacilities());
    expect(result.current.isConnected).toEqual(true);

    act(() => result.current.events.closeConnection());
    expect(result.current.isConnected).toBe(false);

    act(() => result.current.events.reconnect());
    expect(result.current.isConnected).toBe(true);
  });

  it("allows to change contract", () => {
    const { result } = renderHook(() => useCryptoFacilities());
    result.current.events.changeContract();

    expect(mockSendJsonMessage).toHaveBeenCalledTimes(2);
    expect(mockSendJsonMessage).toHaveBeenNthCalledWith(1, {
      event: "unsubscribe",
      feed: "book_ui_1",
      product_ids: ["PI_XBTUSD"],
    });
    expect(mockSendJsonMessage).toHaveBeenNthCalledWith(2, {
      event: "subscribe",
      feed: "book_ui_1",
      product_ids: ["PI_ETHUSD"],
    });
  });

  describe("onMessage", () => {
    const mockMessage = (data: Object = {}) =>
      ({
        data: JSON.stringify({ ...data }),
      } as MessageEvent);

    const deltaQueues = { current: { asks: [], bids: [] } };
    const setBook = jest.fn();
    const updateBook = debounce(jest.fn());
    const onMessage = onMessageWrapper(deltaQueues, setBook, updateBook);

    it("ignores event updates", () => {
      onMessage(mockMessage({ event: "connected" }));
      expect(setBook).not.toBeCalled();
    });

    it("handles new messages", () => {
      onMessage(
        mockMessage({
          feed: "book_ui_1_snapshot",
          product_id: "PI_XBTUSD",
          numLevels: 25,
          bids: [
            [61505, 34537],
            [61375, 1],
          ],
          asks: [
            [61824, 63160],
            [61855, 5672],
          ],
        })
      );

      expect(setBook).toHaveBeenCalledWith({
        asks: [
          { price: 61824, size: 63160, total: 63160 },
          { price: 61855, size: 5672, total: 68832 },
        ],
        bids: [
          { price: 61505, size: 34537, total: 34537 },
          { price: 61375, size: 1, total: 34538 },
        ],
      });
    });

    it("handles updates", () => {
      onMessage(
        mockMessage({
          feed: "book_ui_1",
          bids: [
            [61505, 0],
            [61375, 100],
          ],
          asks: [
            [61824, 0],
            [61855, 300],
            [61860, 20],
          ],
        })
      );
      expect(setBook).not.toHaveBeenCalled();
      expect(deltaQueues).toEqual({
        current: {
          asks: {
            "61824": 0,
            "61855": 300,
            "61860": 20,
          },
          bids: {
            "61375": 100,
            "61505": 0,
          },
        },
      });
    });
  });
});

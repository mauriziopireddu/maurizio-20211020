import { renderHook, act } from "@testing-library/react-hooks";
import { useCryptoFacilities } from "../useCryptoFacilities";

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
});

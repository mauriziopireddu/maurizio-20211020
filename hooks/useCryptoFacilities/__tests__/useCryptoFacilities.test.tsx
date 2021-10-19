import { renderHook, act } from "@testing-library/react-hooks";
import { useCryptoFacilities } from "../useCryptoFacilities";

jest.mock("react-use-websocket", () => {
  return jest.fn(() => ({
    sendJsonMessage: jest.fn(),
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

    act(() => {
      result.current.events.closeConnection();
    });

    expect(result.current.isConnected).toBe(false);

    act(() => {
      result.current.events.reconnect();
    });

    expect(result.current.isConnected).toBe(true);
  });
});

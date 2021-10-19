import { render, screen, getAllByRole } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CryptoFacilities } from "hooks/useCryptoFacilities/types";
import { OrderBook } from "../OrderBook";
import { book as mockBook } from "../__mocks__/book.mock";

const mockCloseConnection = jest.fn();
const mockChangeContract = jest.fn();
const mockReconnect = jest.fn();
let mockIsMobile = false;
let mockIsConnected = true;

jest.mock("hooks/useCryptoFacilities", () => ({
  useCryptoFacilities: () =>
    ({
      book: mockBook,
      isConnected: mockIsConnected,
      events: {
        closeConnection: mockCloseConnection,
        changeContract: mockChangeContract,
        reconnect: mockReconnect,
      },
    } as CryptoFacilities),
}));

jest.mock("hooks/useWindowSize", () => ({
  useWindowSize: () => ({ isMobile: mockIsMobile }),
}));

describe("OrderBook", () => {
  it("renders correctly", async () => {
    render(<OrderBook />);
    expect(
      await screen.findByRole("heading", { name: /order book/i })
    ).toBeVisible();
    const [bidsTable, asksTable] = screen.getAllByRole("table");
    expect(bidsTable).toBeVisible();
    expect(asksTable).toBeVisible();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    const toggleFeedButton = screen.getByRole("button", {
      name: /toggle feed/i,
    });
    expect(toggleFeedButton).toBeVisible();
    userEvent.click(toggleFeedButton);
    expect(mockChangeContract).toHaveBeenCalledTimes(1);
  });

  it("renders a defined amount of orders - desktop view", () => {
    render(<OrderBook />);
    const [bidsTable, asksTable] = screen.getAllByRole("table");
    expect(getAllByRole(bidsTable, "row")).toHaveLength(17);
    expect(getAllByRole(asksTable, "row")).toHaveLength(17);
  });

  it("renders a defined amount of orders - desktop view", () => {
    mockIsMobile = true;
    render(<OrderBook />);
    const [bidsTable, asksTable] = screen.getAllByRole("table");
    expect(getAllByRole(bidsTable, "row")).toHaveLength(13);
    expect(getAllByRole(asksTable, "row")).toHaveLength(13);
  });

  it("renders a modal when the socket connection is disconnected", () => {
    render(<OrderBook />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    mockIsConnected = false;
    render(<OrderBook />);
    expect(screen.getByRole("dialog")).toBeVisible();
    const reconnect = screen.getByRole("button", { name: /reconnect/i });
    userEvent.click(reconnect);
    expect(mockReconnect).toHaveBeenCalledTimes(1);
  });
});

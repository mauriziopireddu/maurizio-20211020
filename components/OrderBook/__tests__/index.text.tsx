import { render, screen } from "@testing-library/react";
import { OrderBook } from "../OrderBook";

describe("Home", () => {
  it("renders without crashing", async () => {
    render(<OrderBook />);
    expect(screen.getByRole("heading", { name: /order book/i })).toBeVisible();
    const [bidsTable, asksTable] = screen.getAllByRole("table");
    expect(bidsTable).toBeVisible();
    expect(asksTable).toBeVisible();
    expect(screen.getByRole("button", { name: /toggle feed/i })).toBeVisible();
  });
});

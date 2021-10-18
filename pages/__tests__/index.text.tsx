import { render, screen } from "@testing-library/react";
import Home from "../index";

describe("Home", () => {
  it("renders without crashing", async () => {
    render(<Home />);
    expect(
      await screen.findByRole("heading", { name: /order book/i })
    ).toBeVisible();
    const [bidsTable, asksTable] = screen.getAllByRole("table");
    expect(bidsTable).toBeVisible();
    expect(asksTable).toBeVisible();
    expect(screen.getByRole("button", { name: /toggle feed/i })).toBeVisible();
  });
});

import { render, screen } from "@testing-library/react";
import { Book } from "types";
import { Spread } from "../Spread";

describe("Spread", () => {
  it("handles an empty book", () => {
    const emptyBook: Book = { asks: [], bids: [] };
    render(<Spread book={emptyBook} />);
    expect(screen.getByText("Spread: N/A")).toBeVisible();
  });

  it("handles a book with no asks", () => {
    const noAsks: Book = {
      asks: [],
      bids: [{ price: 1, size: 1, total: 1 }],
    };
    render(<Spread book={noAsks} />);
    expect(screen.getByText("No asks available")).toBeVisible();
  });

  it("handles a book with no bids", () => {
    const noBids: Book = {
      asks: [{ price: 1, size: 1, total: 1 }],
      bids: [],
    };
    render(<Spread book={noBids} />);
    expect(screen.getByText("No bids available")).toBeVisible();
  });

  it("calculates the spread correctly", () => {
    const book: Book = {
      bids: [
        { price: 1, size: 100, total: 100 },
        { price: 2, size: 150, total: 250 },
        { price: 3, size: 200, total: 450 },
      ],
      asks: [
        { price: 4, size: 100, total: 100 },
        { price: 5, size: 150, total: 250 },
        { price: 6, size: 200, total: 450 },
      ],
    };
    render(<Spread book={book} />);
    expect(screen.getByText("Spread: 3.0 (75.00%)")).toBeVisible();
  });
});

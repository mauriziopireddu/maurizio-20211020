import { render, screen } from "@testing-library/react";
import { Order } from "types";
import { OrderTable, Props as OrderTableProps } from "../OrderTable";

const orders: Order[] = [
  { size: 4317, price: 62628.5, total: 4317 },
  { size: 2960, price: 62627, total: 7277 },
  { size: 7371, price: 62616.5, total: 14648 },
  { size: 29100, price: 62611.5, total: 43748 },
];

const props: OrderTableProps = {
  priceColor: "green-600",
  depthColor: "rgba(0,132,100,.3)",
  orders,
};

describe("OrderTable", () => {
  it("renders correctly", () => {
    render(<OrderTable {...props} />);
    expect(screen.getByRole("table")).toBeVisible();
    const [priceHeading, sizeHeading, totalHeading] =
      screen.getAllByRole("columnheader");
    expect(priceHeading).toHaveTextContent("price");
    expect(sizeHeading).toHaveTextContent("size");
    expect(totalHeading).toHaveTextContent("total");
  });

  it("supports custom column order", () => {
    render(
      <OrderTable {...props} customColumnsOrder={["total", "size", "price"]} />
    );
    const [totalHeading, sizeHeading, priceHeading] =
      screen.getAllByRole("columnheader");
    expect(totalHeading).toHaveTextContent("total");
    expect(sizeHeading).toHaveTextContent("size");
    expect(priceHeading).toHaveTextContent("price");
  });
});

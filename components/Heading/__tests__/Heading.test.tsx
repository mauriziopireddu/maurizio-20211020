import { render, screen } from "@testing-library/react";
import { Heading } from "../Heading";

describe("Heading", () => {
  it("renders correctly", () => {
    render(<Heading>Hello</Heading>);
    expect(screen.getByRole("banner")).toBeVisible();
    expect(screen.getByRole("heading", { name: /order book/i })).toBeVisible();
    expect(screen.getByText("Hello")).toBeVisible();
  });
});

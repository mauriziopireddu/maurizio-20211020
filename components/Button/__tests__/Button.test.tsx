import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "../Button";

describe("Button", () => {
  it("renders correctly", () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Click me</Button>);
    const button = screen.getByRole("button");

    expect(button).toBeVisible();

    userEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

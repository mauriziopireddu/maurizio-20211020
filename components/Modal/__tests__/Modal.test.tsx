import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Modal } from "../Modal";

describe("Modal", () => {
  it("renders correctly", () => {
    const onClick = jest.fn();
    render(<Modal onClick={onClick} />);

    const reconnect = screen.getByRole("button", { name: /reconnect/i });

    expect(screen.getByRole("dialog")).toBeVisible();
    expect(screen.getByText(/feed disconnected/i)).toBeVisible();
    expect(screen.getByText(/you have been disconnected/i)).toBeVisible();
    expect(reconnect).toBeVisible();

    userEvent.click(reconnect);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

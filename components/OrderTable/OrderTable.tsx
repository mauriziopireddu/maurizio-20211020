import { useWindowSize } from "hooks/useWindowSize";
import { Order } from "types";

type Type = "bid" | "ask";
type Direction = "to left" | "to right";
type Column = "total" | "size" | "price";

type Props = {
  type: Type;
  customColumnsOrder?: Column[];
  showHeading?: boolean;
  direction?: Direction;
  orders?: Order[];
};

const defaultColumnsOrder = ["price", "size", "total"];

const depthStyle = (type: Type, size: number, direction: Direction) =>
  type === "bid"
    ? `linear-gradient(${direction}, #123534 ${size}%, transparent 0%)`
    : `linear-gradient(${direction}, #3D1E28 ${size}%, transparent 0%)`;

const getDepth = (total: number) => (current: number) =>
  (current / total) * 100;

export const OrderTable = ({
  type,
  customColumnsOrder,
  showHeading = true,
  direction = "to left",
  orders = [],
}: Props) => {
  const priceColor = type === "bid" ? "green" : "red";
  const { isMobile } = useWindowSize();
  const shouldHaveCustomColumnsOrder = !isMobile && customColumnsOrder?.length;
  const columns = shouldHaveCustomColumnsOrder
    ? customColumnsOrder
    : defaultColumnsOrder;

  const highestTotal = orders[orders.length - 1]?.total;
  const getCurrentDepth = getDepth(highestTotal);

  return (
    <table className="w-screen text-center table-fixed">
      <thead
        className={`${showHeading ? "" : "hidden"} border-b-1 border-secondary`}
      >
        <tr className="uppercase text-secondary">
          {columns.map((column) => (
            <th key={column}>{column}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        {orders.map((order) => (
          <tr
            key={order.total}
            style={{
              background: depthStyle(
                type,
                getCurrentDepth(order.total),
                direction
              ),
            }}
          >
            {columns.map((column) => (
              <td
                key={`${order.total}-${column}`}
                className={`py-0.5 ${
                  column === "price" ? `text-${priceColor}-600` : ""
                }`}
              >
                {order[column].toLocaleString()}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

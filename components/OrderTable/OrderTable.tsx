import { useWindowSize } from "hooks/useWindowSize";
import { Order } from "types";

type Type = "bid" | "ask";
type DepthDirection = "to left" | "to right";
type Column = "total" | "size" | "price";

type Props = {
  type: Type;
  customColumnsOrder?: Column[];
  showHeading?: boolean;
  depthDirection?: DepthDirection;
  orders?: Order[];
  reverse?: boolean;
};

const defaultColumnsOrder = ["price", "size", "total"];

const depthStyle = (type: Type, size: number, direction: DepthDirection) =>
  type === "bid"
    ? `linear-gradient(${direction}, #123534 ${size}%, transparent 0%)`
    : `linear-gradient(${direction}, #3D1E28 ${size}%, transparent 0%)`;

const getDepth = (total: number) => (current: number) =>
  (current / total) * 100;

export const OrderTable = ({
  type,
  customColumnsOrder = [],
  showHeading = true,
  depthDirection = "to left",
  orders = [],
  reverse = false,
}: Props) => {
  const priceColor = type === "bid" ? "green" : "red";
  const { isMobile } = useWindowSize();
  const shouldHaveCustomColumnsOrder = !isMobile && customColumnsOrder.length;
  const columns = shouldHaveCustomColumnsOrder
    ? customColumnsOrder
    : defaultColumnsOrder;

  const highestTotal = orders[orders.length - 1]?.total;
  const getCurrentDepth = getDepth(highestTotal);
  const sortedOrders = reverse ? [...orders].reverse() : orders;

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
        {sortedOrders.map((order) => (
          <tr
            key={order.price}
            style={{
              background: depthStyle(
                type,
                getCurrentDepth(order.total),
                depthDirection
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
                {column === "price"
                  ? order[column].toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                  : //@ts-ignore
                    order[column].toLocaleString()}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

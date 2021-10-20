import { Order } from "types";
import { Head } from "./Head";

type DepthDirection = "left" | "right";
type Column = "total" | "size" | "price";

export type Props = {
  id: string;
  orders: Order[];
  priceColor: "green-600" | "red-600";
  depthColor: "rgba(0,132,100,.3)" | "rgba(160,55,55,.3)";
  isMobile?: boolean;
  customColumnsOrder?: Column[];
  showHeading?: boolean;
  depthDirection?: DepthDirection;
  reverse?: boolean;
};

const defaultColumnsOrder = ["price", "size", "total"];

const depthStyle = (
  color: string,
  size: number,
  direction: DepthDirection
) => ({
  background: color,
  inset: direction === "left" ? `0 0 0 ${size}%` : `0 ${size}% 0 0`,
});

const getDepth = (total: number) => (current: number) =>
  (1 - current / total) * 100;

export const OrderTable = ({
  id,
  customColumnsOrder = [],
  showHeading = true,
  depthDirection = "left",
  orders = [],
  isMobile = false,
  priceColor,
  depthColor,
  reverse = false,
}: Props) => {
  const shouldHaveCustomColumnsOrder = !isMobile && customColumnsOrder.length;
  const columns = shouldHaveCustomColumnsOrder
    ? customColumnsOrder
    : defaultColumnsOrder;

  const highestTotal = orders[orders.length - 1]?.total;
  const getCurrentDepth = getDepth(highestTotal);
  const sortedOrders = reverse ? [...orders].reverse() : orders;

  return (
    <table className="w-screen text-center">
      <Head columns={columns} showHeading={showHeading} />
      <tbody>
        {sortedOrders.map((order) => (
          <tr key={order.price} className="relative">
            {columns.map((column) => (
              <td
                key={`${id}-${column}`}
                className={`py-0.5 ${
                  column === "price" ? `text-${priceColor}` : ""
                }`}
              >
                {(() => {
                  if (column === "price") {
                    return order[column].toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    });
                  }
                  if (column === "size" || column === "total") {
                    return order[column].toLocaleString();
                  }
                  return null;
                })()}
              </td>
            ))}
            <td
              className="absolute w-auto"
              style={depthStyle(
                depthColor,
                getCurrentDepth(order.total),
                depthDirection
              )}
            ></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

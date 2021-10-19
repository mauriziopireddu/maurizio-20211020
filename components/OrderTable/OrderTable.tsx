import { Order } from "types";
import { Head } from "./Head";

type DepthDirection = "to left" | "to right";
type Column = "total" | "size" | "price";

export type Props = {
  orders: Order[];
  priceColor: "green-600" | "red-600";
  depthColor: "#123534" | "#3D1E28";
  isMobile?: boolean;
  customColumnsOrder?: Column[];
  showHeading?: boolean;
  depthDirection?: DepthDirection;
  reverse?: boolean;
};

const defaultColumnsOrder = ["price", "size", "total"];

const depthStyle = (
  depthColor: string,
  size: number,
  direction: DepthDirection
) => `linear-gradient(${direction}, ${depthColor} ${size}%, transparent 0%)`;

const getDepth = (total: number) => (current: number) =>
  (current / total) * 100;

export const OrderTable = ({
  customColumnsOrder = [],
  showHeading = true,
  depthDirection = "to left",
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
    <table className="w-screen text-center table-fixed">
      <Head columns={columns} showHeading={showHeading} />
      <tbody>
        {sortedOrders.map((order) => (
          <tr
            key={order.price}
            style={{
              background: depthStyle(
                depthColor,
                getCurrentDepth(order.total),
                depthDirection
              ),
            }}
          >
            {columns.map((column) => (
              <td
                key={`${order.total}-${column}`}
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
          </tr>
        ))}
      </tbody>
    </table>
  );
};

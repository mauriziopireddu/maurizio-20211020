import { useWindowSize } from "hooks/useWindowSize";

type Type = "bid" | "ask";
type Direction = "to left" | "to right";

type Props = {
  type: Type;
  customColumnsOrder?: string[];
  showHeading?: boolean;
  direction?: Direction;
};

const values = [
  { id: 1, total: 1200, size: 1200, price: 34062.5 },
  { id: 2, total: 1200, size: 1200, price: 34062.5 },
  { id: 3, total: 1200, size: 1200, price: 34062.5 },
];

const defaultColumnsOrder = ["price", "size", "total"];

const barStyle = (type: Type, size: number, direction: Direction) =>
  type === "bid"
    ? `linear-gradient(${direction}, #123534 ${size}%, transparent 0%)`
    : `linear-gradient(${direction}, #3D1E28 ${size}%, transparent 0%)`;

export const OrderTable = ({
  type,
  customColumnsOrder,
  showHeading = true,
  direction = "to left",
}: Props) => {
  const priceColor = type === "bid" ? "green" : "red";
  const { isMobile } = useWindowSize();
  const shouldHaveCustomColumnsOrder = !isMobile && customColumnsOrder?.length;
  const columns = shouldHaveCustomColumnsOrder
    ? customColumnsOrder
    : defaultColumnsOrder;

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
        {values.map((entry) => (
          <tr
            key={entry.id}
            style={{ background: barStyle(type, 20, direction) }}
          >
            {columns.map((column) => (
              <td
                key={`${entry.id}-${column}`}
                className={`py-0.5 ${
                  column === "price" ? `text-${priceColor}-600` : ""
                }`}
              >
                {entry[column]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

import React from "react";

type Type = "bid" | "ask";

type Props = {
  type: Type;
};

const barStyle = (type: Type, size: number) =>
  type === "bid"
    ? `linear-gradient(to left, #123534 ${size}%, transparent 0%)`
    : `linear-gradient(to right, #3D1E28 ${size}%, transparent 0%)`;

export const OrderTable = ({ type }: Props) => {
  const priceColor = type === "bid" ? "green" : "red";
  return (
    <table className="w-screen text-center">
      <thead className="border-b-1 border-secondary">
        <tr className="uppercase text-secondary">
          <th>Total</th>
          <th>Size</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        <tr style={{ background: barStyle(type, 20) }}>
          <td>1,200</td>
          <td>1,200</td>
          <td className={`text-${priceColor}-500`}>34,062.50</td>
        </tr>
        <tr>
          <td>1,200</td>
          <td>1,200</td>
          <td className={`text-${priceColor}-500`}>34,062.50</td>
        </tr>
        <tr>
          <td>1,200</td>
          <td>1,200</td>
          <td className={`text-${priceColor}-500`}>34,062.50</td>
        </tr>
      </tbody>
    </table>
  );
};

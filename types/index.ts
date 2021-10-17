export type ProductId = "PI_XBTUSD" | "PI_ETHUSD";

export type Order = {
  total: number;
  size: number;
  price: number;
};

export type Book = {
  bids: Order[];
  asks: Order[];
};

export type Delta = [number, number];

import { Book } from "types";
import { MessageData } from "../types";
import { createBook, processQueues, updateQueues } from "../utils";

describe("utils", () => {
  test("createBook", () => {
    const data: MessageData = {
      numLevels: 25,
      feed: "book_ui_1",
      bids: [
        [61891, 1839],
        [61888.5, 7958],
        [61886.5, 450],
      ],
      asks: [
        [61949, 20000],
        [61953.5, 2063],
        [61955, 65188],
      ],
      product_id: "PI_XBTUSD",
    };
    const book = createBook(data);
    expect(book).toEqual({
      asks: [
        { price: 61949, size: 20000, total: 20000 },
        { price: 61953.5, size: 2063, total: 22063 },
        { price: 61955, size: 65188, total: 87251 },
      ],
      bids: [
        { price: 61891, size: 1839, total: 1839 },
        { price: 61888.5, size: 7958, total: 9797 },
        { price: 61886.5, size: 450, total: 10247 },
      ],
    });
  });

  test("updateQueues", () => {
    const queues = {
      asks: { "61824": 63163, "61855": 5672, "61861.5": 0 },
      bids: { "61505": 0, "61622": 14848 },
    };

    const newQueues = {
      asks: { "61824": 63160, "61855": 5672, "61861.5": 5205, "61869": 114918 },
      bids: { "61375": 1, "61505": 34537, "61622": 14849, "61650.5": 0 },
    };

    const updates: MessageData = {
      feed: "book_ui_1",
      product_id: "PI_XBTUSD",
      numLevels: 25,
      bids: [
        [61505, 34537],
        [61375, 1],
        [61622, 14849],
        [61650.5, 0],
      ],
      asks: [
        [61824, 63160],
        [61855, 5672],
        [61861.5, 5205],
        [61869, 114918],
      ],
    };
    expect(updateQueues(queues, updates)).toEqual(newQueues);
  });

  test("processQueues", () => {
    const queues = {
      asks: { "61824": 160, "61855": 0, "61861.5": 4205, "61869": 114918 },
      bids: { "61375": 300, "61505": 0, "61622": 2849 },
    };

    const book: Book = {
      asks: [
        { price: 61824, size: 63160, total: 63160 },
        { price: 61855, size: 5672, total: 68842 },
        { price: 61861.5, size: 5205, total: 74047 },
      ],
      bids: [
        { price: 61375, size: 1, total: 1 },
        { price: 61505, size: 34537, total: 34538 },
        { price: 61622, size: 14849, total: 49386 },
      ],
    };

    const newBook: Book = {
      asks: [
        { price: 61824, size: 160, total: 160 },
        { price: 61861.5, size: 4205, total: 4365 },
        { price: 61869, size: 114918, total: 119283 },
      ],
      bids: [
        { price: 61375, size: 300, total: 300 },
        { price: 61622, size: 2849, total: 3149 },
      ],
    };

    expect(processQueues(book, queues)).toEqual(newBook);
  });
});

import type { NextPage } from "next";
import { Heading } from "components/Heading";
import { OrderTable } from "components/OrderTable";

const Home: NextPage = () => {
  return (
    <>
      <Heading />
      <hr className="border-gray-700" />
      <main className="flex">
        <OrderTable type="bid" />
        <OrderTable type="ask" />
      </main>
      <footer></footer>
    </>
  );
};

export default Home;

import type { AppProps } from "next/app";
import Head from "next/head";
import "tailwindcss/tailwind.css";
import "styles/globals.css";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <title>Maurizio | 2021-10-17</title>
      </Head>
      <div className="bg-black h-screen text-white">
        <Component {...pageProps} />
      </div>
    </>
  );
};

export default MyApp;

import type { NextPage } from "next";
import Head from "next/head";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Simple Notes</title>
        <meta name="description" content="Simple notes" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>Page content</div>
    </>
  );
};

export default Home;

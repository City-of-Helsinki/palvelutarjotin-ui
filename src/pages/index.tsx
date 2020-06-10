import Head from 'next/head';
import React from 'react';

const Home = (): React.ReactElement => {
  return (
    <div>
      <Head>
        <title>Palvelutarjotin</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Welcome to Palvelutarjotin</h1>
      </main>
    </div>
  );
};

export default Home;

import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "@/components/Layout";
import { io } from "socket.io-client";

const ENDPOINT = "http://127.0.0.1:8000";
const socket = io(ENDPOINT);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component socket={socket} {...pageProps} />
    </Layout>
  );
}

export default MyApp;

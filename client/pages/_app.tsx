import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "@/components/Layout";
import { io } from "socket.io-client";
import { StringDecoder } from "string_decoder";

const ENDPOINT = process.env.SERVER_ENDPOINT as string;
const socket = io(ENDPOINT);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component socket={socket} {...pageProps} />
    </Layout>
  );
}

export default MyApp;

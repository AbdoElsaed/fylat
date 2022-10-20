import type { NextPage } from "next";
import styles from "@/styles/Home.module.css";
import Hero from "@/components/Hero";

const Home: NextPage = ({ socket }: any) => {
  return (
    <div className={styles.container}>
      <Hero socket={socket} />
    </div>
  );
};

export default Home;

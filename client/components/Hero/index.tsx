import styles from "@/styles/Hero.module.css";
import { Box, Grid, Typography } from "@mui/material";
import Image from "next/image";

import HeroForm from "./HeroForm";

const index = ({ socket }: any) => {
  return (
    <Box className={styles.container}>
      <Grid container justifyContent="space-around">
        <Grid item mt={10}>
          <Typography variant="h3" className={styles.headline}>
            Sharing is caring
          </Typography>
          <Typography variant="h4" className={styles.slogan}>
            Start sharing things with your friends in a fun way
          </Typography>
          <HeroForm socket={socket} />
        </Grid>
        <Grid item>
          <Image
            src="/images/bg.png"
            alt="Logo Image"
            width={600}
            height={600}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default index;

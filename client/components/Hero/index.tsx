import styles from "@/styles/Hero.module.css";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Image from "next/image";

import { useDeviceDetect } from "@/utils/hooks";
import HeroForm from "./HeroForm";

const Hero = ({ socket }: any) => {
  const isMobile = useDeviceDetect();
  return (
    <Box className={styles.container}>
      <Grid container justifyContent="space-around">
        <Grid item mt={10} md={6}>
          <Typography variant="h3" className={styles.headline}>
            Sharing is caring
          </Typography>
          <Typography variant="h4" className={styles.slogan}>
            Start sharing files with your friends in a fun way
          </Typography>
          <HeroForm socket={socket} />
        </Grid>
        <Grid item md={6} style={{ margin: 0, padding: 0, maxWidth: 600 }}>
          <div className={styles.imageContainer}>
            <Image
              src="/images/bg.png"
              alt="Logo Image"
              fill
              className={styles.image}
            />
          </div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Hero;

import Image from "next/image";
import Link from "next/link";
import { Box, Grid } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import BuyMeACoffee from "@/components/BuyMeACoffee";

export default function index() {
  return (
    <Box sx={{ flexGrow: 1, mt: 3, mb: 1 }}>
      <Grid
        container
        justifyContent="space-around"
        alignItems="center"
        alignContent="center"
      >
        <Grid item>
          <Link href="/">
            <Image
              src="/images/logo.png"
              alt="Logo Image"
              width={80}
              height={80}
            />
          </Link>
        </Grid>
        <Grid
          item
          sx={{
            width: "15%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <a
            href="https://github.com/AbdoElsaed/FutureMe"
            rel="noopener noreferrer"
            target="_blank"
          >
            <GitHubIcon sx={{ fontSize: "40px" }} />
          </a>
          <BuyMeACoffee />
        </Grid>
      </Grid>
    </Box>
  );
}

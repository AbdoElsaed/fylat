import Image from "next/image";
import Link from "next/link";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import GitHubIcon from "@mui/icons-material/GitHub";
import CoffeeIcon from "@mui/icons-material/Coffee";

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
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <a
            href="https://github.com/AbdoElsaed/FutureMe"
            rel="noopener noreferrer"
            target="_blank"
          >
            <GitHubIcon sx={{ fontSize: "40px", color: "#888" }} />
          </a>
          <a
            href="https://www.buymeacoffee.com/gatsbybom"
            target="_blank"
            rel="noreferrer"
            title="Buy me a coffee"
          >
            <CoffeeIcon sx={{ fontSize: "40px", color: "#888" }} />
          </a>
        </Grid>
      </Grid>
    </Box>
  );
}

import { useMemo } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import { SnackbarProvider } from "notistack";

import Header from "./Header";
import Meta from "./Meta";

const Layout = ({ children }: any) => {
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: "dark",
        },
      }),
    []
  );

  return (
    <>
      <Meta />
      <SnackbarProvider
        maxSnack={3}
        autoHideDuration={4000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        preventDuplicate={true}
        dense={true}
      >
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Header />
          <Divider />
          {children}
        </ThemeProvider>
      </SnackbarProvider>
    </>
  );
};

export default Layout;

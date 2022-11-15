import React from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import ShareIcon from "@mui/icons-material/Share";
import LogoutIcon from "@mui/icons-material/Logout";

export const SessionHeader = ({ id }: any) => {
  return (
    <Box sx={{ flexGrow: 1, mt: 5, mb: 3 }}>
      <Grid container justifyContent="space-around">
        <Grid item>
          <Typography variant="h5">Session : {id}</Typography>
          <Typography sx={{ color: "#666", fontSize: "14px" }} component="p">
            (session will be removed automatically when everyone leaves)
          </Typography>
        </Grid>
        <Grid item>
          <Stack direction="row" spacing={1}>
            <IconButton
              color="primary"
              title="Share Link"
              aria-label="share session link"
            >
              <ShareIcon />
            </IconButton>
            <IconButton
              color="secondary"
              title="Remove Session"
              aria-label="remove session"
            >
              <DeleteIcon />
            </IconButton>
            <IconButton title="Leave Session" aria-label="Leave Session">
              <LogoutIcon />
            </IconButton>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

import React from "react";
import { useRouter } from "next/router";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import ShareIcon from "@mui/icons-material/Share";
import LogoutIcon from "@mui/icons-material/Logout";
import { useSnackbar } from "notistack";

export const SessionHeader = ({ id, role, socket, userName }: any) => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const handleClosingSessionAsAdmin = async () => {
    await new Promise((resolve) => {
      resolve(router.push("/"));
    });
    socket.emit("removeSession", { sessionId: id, userName }, (err: string) => {
      if (err) {
        console.error(err);
        return enqueueSnackbar(err, { variant: "error" });
      }
      enqueueSnackbar(`Session ${id} closed successfully`, {
        variant: "success",
      });
    });
  };

  const handleLeavingSessionAsMember = async () => {
    await new Promise((resolve) => {
      resolve(router.push("/"));
    });
    socket.emit("leaveSession", { sessionId: id, userName }, (err: string) => {
      if (err) {
        console.error(err);
        return enqueueSnackbar(err, { variant: "error" });
      }
      enqueueSnackbar(`You left session : ${id}`, {
        variant: "success",
      });
    });
  };

  const shareSessionLink = () => {
    const url = `localhost:3000?invitedSessionId=${id}`;
    navigator.clipboard.writeText(url);
    enqueueSnackbar(
      `shared session link has been copied to clipboard successfully`,
      {
        variant: "success",
      }
    );
  };

  return (
    <Box sx={{ flexGrow: 1, mt: 5, mb: 3, p: 1 }}>
      <Grid container justifyContent="space-around">
        <Grid item>
          <Typography variant="h5">Session ID : {id}</Typography>
          <Typography sx={{ color: "#777", fontSize: "14px" }} component="p">
            (session will expire automaticaly after 2 hours).
          </Typography>
          <Typography sx={{ color: "#777", fontSize: "14px" }} component="p">
            {role === "admin"
              ? "(As session admin, session will be permanently removed when you leave)."
              : null}
          </Typography>
        </Grid>
        <Grid item>
          <Stack direction="row" spacing={1}>
            <IconButton
              color="primary"
              title="Share session Link"
              aria-label="share session link"
              onClick={shareSessionLink}
            >
              <ShareIcon />
            </IconButton>
            {role === "admin" ? (
              <IconButton
                color="secondary"
                title="Close Session"
                aria-label="close session"
                onClick={handleClosingSessionAsAdmin}
              >
                <DeleteIcon />
              </IconButton>
            ) : null}
            {role === "member" ? (
              <IconButton
                title="Leave Session"
                aria-label="Leave Session"
                onClick={handleLeavingSessionAsMember}
              >
                <LogoutIcon />
              </IconButton>
            ) : null}
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

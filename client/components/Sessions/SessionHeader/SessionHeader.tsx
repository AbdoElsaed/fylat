import React from "react";
import { useRouter } from "next/router";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import ShareIcon from "@mui/icons-material/Share";
import { useSnackbar } from "notistack";
import { doc, deleteDoc } from "firebase/firestore";
import { db, deleteSessionFiles } from "@/utils/firebase";

export const SessionHeader = ({ id, type }: any) => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const deleteSession = async () => {
    if (window.confirm(`you sure about deleting session : ${id} ?`)) {
      try {
        await deleteDoc(doc(db, "sessions", id));
        await deleteSessionFiles(id);
        enqueueSnackbar(`Session ${id} deleted successfully`, {
          variant: "success",
        });
        router.push("/");
      } catch (err: any) {
        console.error(err.message);
      }
    }
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
            {type === "admin" ? (
              <IconButton
                color="secondary"
                title="Delete Session"
                aria-label="Delete session"
                onClick={deleteSession}
              >
                <DeleteIcon />
              </IconButton>
            ) : null}
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

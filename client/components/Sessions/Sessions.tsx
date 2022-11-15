import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { SessionHeader } from "./SessionHeader";
import { FilesArea } from "./FilesArea";
import { Chat } from "./Chat";

export const Sessions = ({ isNew, userName, id, socket }: any) => {
  return (
    <Box sx={{ flexGrow: 1, mt: 10 }}>
      <SessionHeader id={id} />
      <Grid sx={{ mt: 10 }} container spacing={2} justifyContent="space-around">
        <Grid item>
          <FilesArea
            isNew={isNew}
            userName={userName}
            id={id}
            socket={socket}
          />
        </Grid>
        <Divider orientation="vertical" flexItem />
        <Grid item>
          <Chat isNew={isNew} userName={userName} id={id} socket={socket} />
        </Grid>
      </Grid>
    </Box>
  );
};

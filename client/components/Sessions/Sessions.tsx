import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { db } from "@/utils/firebase";
import { SessionHeader } from "./SessionHeader";
import { FilesArea } from "./FilesArea";
import { Chat } from "./Chat";

interface SessionParams {
  isNew: boolean;
  user: IUser;
  id: string;
}

export const Sessions = ({
  isNew,
  user: { userName, type },
  id,
}: SessionParams) => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [filesToDownload, setFilesToDownload] = useState<IFile[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "sessions", id), (doc) => {
      const sessionData = doc.data() as ISession;
      const msgs: IMessage[] = sessionData?.messages ?? [];
      const files: IFile[] = sessionData?.files ?? [];
      setMessages(msgs);
      setFilesToDownload(files);
    });

    return () => unsubscribe();
  }, [id]);

  useEffect(() => {
    const eventSource = new EventSource("/api/session");
    eventSource.onmessage = (event) => {
      console.log({ event });
      const data = JSON.parse(event.data);
      if (data.sessionId === id) {
        // redirect the user to the home page
        window.location.href = "/";
      }
    };
    return () => {
      eventSource.close();
    };
  }, [id]);

  return (
    <Box sx={{ flexGrow: 1, mt: 10 }}>
      <SessionHeader id={id} type={type} />
      <Grid sx={{ mt: 10 }} container spacing={2} justifyContent="space-around">
        <Grid md={5} item>
          <FilesArea id={id} filesToDownload={filesToDownload} />
        </Grid>
        <Grid md={5} item>
          <Chat isNew={isNew} userName={userName} id={id} messages={messages} />
        </Grid>
      </Grid>
    </Box>
  );
};

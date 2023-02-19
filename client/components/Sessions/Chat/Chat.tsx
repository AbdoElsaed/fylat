import { useState, useEffect, useRef, Dispatch, SetStateAction } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import styles from "@/styles/Chat.module.css";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import SendIcon from "@mui/icons-material/Send";
import Avatar from "@mui/material/Avatar";
import { doc, updateDoc, arrayUnion, onSnapshot } from "firebase/firestore";

import { db } from "@/utils/firebase";
import { stringAvatar } from "@/utils/chat";

interface ChatParams {
  isNew: boolean;
  userName: string;
  id: string;
  messages: IMessage[];
}

export const Chat = ({ isNew, userName, id, messages }: ChatParams) => {
  const [msg, setMsg] = useState<string>("");

  const sessionRef = doc(db, "sessions", id);

  let msgsContainerRef: any = useRef("");

  useEffect(() => {
    // update scroll height
    msgsContainerRef.current.scrollTop = msgsContainerRef.current.scrollHeight;
  }, [messages.length]);

  const onCLick = async () => {
    if (!msg.trim()) return;
    const newMsg: IMessage = { sender: userName, text: msg };
    setMsg("");
    try {
      await updateDoc(sessionRef, {
        messages: arrayUnion(newMsg),
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box
      sx={{
        flexGrow: 10,
      }}
    >
      <Typography
        variant="h5"
        letterSpacing={1}
        sx={{
          color: "#DDD",
          textAlign: "center",
          textShadow: "1px 1px 4px #158af8",
          borderBottom: "1px solid #222",
          width: "max-content",
          margin: "auto",
          mb: 3,
        }}
      >
        Session Chat:
      </Typography>
      <Stack sx={{ justifyContent: "center" }}>
        <Box
          ref={msgsContainerRef}
          style={{
            maxHeight: "300px",
            overflowY: "auto",
            minWidth: "400px",
            scrollBehavior: "smooth",
          }}
        >
          {messages.map((msg, i) => (
            <Stack key={i}>
              <Stack
                direction="row"
                sx={{ alignItems: "center", ml: 1 }}
                spacing={1}
              >
                <Avatar {...stringAvatar(msg.sender)} />
                <Typography component="p" gutterBottom sx={{ color: "#777" }}>
                  {msg.sender}
                </Typography>
              </Stack>
              <Typography
                component="p"
                gutterBottom
                sx={{
                  wordBreak: "break-all",
                  mb: 2,
                  ml: 6,
                  mr: 2,
                  color: "#CCC",
                }}
              >
                {msg.text}
              </Typography>
            </Stack>
          ))}
        </Box>
        <Stack
          spacing={2}
          direction="row"
          sx={{
            alignItems: "flex-end",
            mt: 5,
            m: 2,
          }}
        >
          <TextField
            sx={{ width: "100%" }}
            id="msg"
            placeholder="send a messsag.."
            variant="standard"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && onCLick()}
          />
          <IconButton
            onClick={onCLick}
            color="primary"
            aria-label="delete"
            disabled={!msg.trim()}
          >
            <SendIcon />
          </IconButton>
        </Stack>
      </Stack>
    </Box>
  );
};

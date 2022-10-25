import { useState, useEffect, useRef } from "react";
import { Grid, Typography, Stack } from "@mui/material";
import { Box } from "@mui/system";
import styles from "@/styles/Chat.module.css";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import SendIcon from "@mui/icons-material/Send";
import Avatar from "@mui/material/Avatar";

import { stringAvatar } from "@/utils/chat";

interface IMessage {
  sender: string;
  text: string;
}

export const Chat = ({ isNew, userName, id: sessionId, socket }: any) => {
  const [msg, setMsg] = useState<string>("");
  const [messages, setMessages] = useState<IMessage[]>([]);

  let msgsContainerRef: any = useRef("");

  useEffect(() => {
    // update scroll height
    msgsContainerRef.current.scrollTop = msgsContainerRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    // get initial msgs
    socket.emit(
      "getInitMsgs",
      { sessionId },
      (err: Error, msgs: IMessage[]) => {
        if (!err) return setMessages(msgs);
        console.error(err);
      }
    );

    socket.on("newMsgAdded", (msgs: IMessage[]) => setMessages(msgs));
  }, [socket, sessionId]);

  const onCLick = () => {
    socket.emit(
      "sendChatMsg",
      { msg, userName, sessionId },
      (err: Error, msgs: IMessage[]) => {
        if (err) {
          return console.error(err);
        }
        setMessages(msgs);
      }
    );
    setMsg("");
  };

  return (
    <Box sx={{ flexGrow: 10 }}>
      <Stack sx={{ justifyContent: "center" }}>
        <Box
          ref={msgsContainerRef}
          style={{
            maxHeight: "300px",
            overflowY: "auto",
            maxWidth: "500px",
            minWidth: "400px",
            scrollBehavior: "smooth",
          }}
        >
          {messages.map((msg, i) => (
            <Stack key={i}>
              <Stack direction="row" sx={{ alignItems: "center" }} spacing={1}>
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
          }}
        >
          <TextField
            sx={{ width: "100%" }}
            id="msg"
            placeholder="send msg..."
            variant="standard"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && onCLick()}
          />
          <IconButton onClick={onCLick} color="primary" aria-label="delete">
            <SendIcon />
          </IconButton>
        </Stack>
      </Stack>
    </Box>
  );
};

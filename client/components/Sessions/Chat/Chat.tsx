import { useState } from "react";
import { Grid, Typography, Stack } from "@mui/material";
import { Box } from "@mui/system";
import styles from "@/styles/Chat.module.css";

export const Chat = () => {
  const [messages, setMessages] = useState([
    { text: "msg111", userName: "apdo" },
    { text: "msg222", userName: "gatsby" },
    { text: "msg333", userName: "blahnla" },
    { text: "msg111", userName: "apdo" },
    { text: "msg222", userName: "gatsby" },
    { text: "msg333", userName: "blahnla" },
  ]);

  return (
    <Box sx={{ flexGrow: 10 }}>
      <Stack sx={{ display: "flex", justifyContent: "center" }}>
        {messages.map((msg, i) => (
          <div key={i}>
            <Typography
              component="p"
              gutterBottom
              sx={i % 2 === 0 ? { color: "red" } : { color: "green" }}
            >
              {msg.userName} | {msg.text}
            </Typography>
          </div>
        ))}
      </Stack>
    </Box>
  );
};

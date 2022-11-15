import { useState } from "react";
import styles from "@/styles/Hero.module.css";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import AddCircle from "@mui/icons-material/AddCircle";
import ArrowCircleDown from "@mui/icons-material/ArrowCircleDown";
import { useRouter } from "next/router";

const HeroForm = ({ socket }: any) => {
  socket.on("newUserJoined", ({ userName }: any) => {
    console.log(`${userName} joined the session`);
  });

  const [startBtnLoading, setStartBtnLoading] = useState<boolean>(false);
  const [joinBtnLoading, setJoinBtnLoading] = useState<boolean>(false);
  const [id, setId] = useState<string>("");
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");
  const router = useRouter();

  const goToSession = (isNew: boolean, err: string) => {
    console.log(err);
    if (err) {
      isNew ? setStartBtnLoading(false) : setJoinBtnLoading(false);
      console.error(err);
      alert(err);
    } else {
      router.push(`/session/${id}?userName=${userName}&isNew=${isNew}`);
    }
  };

  const joinRoom = (isNew: boolean) => {
    const data = {
      sessionId: id,
      userName,
      isNew,
    };

    socket.emit("joinSession", data, (err: any) => {
      console.log("errrr", err);
      goToSession(isNew, err);
    });
  };

  const handleClick = (isNew: boolean) => {
    isNew ? setStartBtnLoading(true) : setJoinBtnLoading(true);
    joinRoom(isNew);
    // goToSession(isNew);
  };

  return (
    <Stack
      component="form"
      sx={{
        width: "80%",
        mt: 10,
      }}
      spacing={4}
      noValidate
      autoComplete="off"
      justifyContent="center"
      alignItems="center"
      alignContent="center"
    >
      <TextField
        className={styles.textInput}
        id="sessionId"
        label="Session ID"
        variant="outlined"
        onChange={(e) => setId(e.target.value)}
      />
      <TextField
        className={styles.textInput}
        id="username"
        label="User Name"
        variant="outlined"
        onChange={(e) => setUserName(e.target.value)}
      />
      <Stack
        spacing={2}
        direction="row"
        justifyContent="center"
        alignItems="center"
        alignContent="center"
      >
        <LoadingButton
          onClick={() => handleClick(true)}
          className={styles.btn}
          variant="contained"
          loadingPosition="end"
          endIcon={<AddCircle />}
          loading={startBtnLoading}
        >
          Start a new session
        </LoadingButton>
        <p>OR</p>
        <LoadingButton
          onClick={() => handleClick(false)}
          className={styles.btn}
          variant="outlined"
          loadingPosition="end"
          endIcon={<ArrowCircleDown />}
          loading={joinBtnLoading}
        >
          Join an exist session
        </LoadingButton>
      </Stack>
    </Stack>
  );
};

export default HeroForm;

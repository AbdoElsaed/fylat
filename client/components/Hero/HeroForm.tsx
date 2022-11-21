import { useState } from "react";
import styles from "@/styles/Hero.module.css";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import AddCircle from "@mui/icons-material/AddCircle";
import ArrowCircleDown from "@mui/icons-material/ArrowCircleDown";
import Button from "@mui/material/Button";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";

const HeroForm = ({ socket }: any) => {
  const { enqueueSnackbar } = useSnackbar();

  socket.on("newUserJoined", ({ userName }: any) => {
    console.log(`${userName} joined the session`);
  });

  const [startBtnLoading, setStartBtnLoading] = useState<boolean>(false);
  const [joinBtnLoading, setJoinBtnLoading] = useState<boolean>(false);
  const [id, setId] = useState<string>("");
  const [userName, setUserName] = useState<string>("");

  const router = useRouter();

  const generateId = () => setId(Math.random().toString(36).slice(2));

  const goToSession = (isNew: boolean, err: string) => {
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
      goToSession(isNew, err);
    });
  };

  const handleClick = (isNew: boolean) => {
    if (!id.trim() || !userName.trim()) {
      return enqueueSnackbar("Please fill the form!", { variant: "error" });
    }
    isNew ? setStartBtnLoading(true) : setJoinBtnLoading(true);
    joinRoom(isNew);
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
      <div style={{ display: "flex", flexDirection: "row", width: "85%" }}>
        <TextField
          className={styles.textInput}
          id="sessionId"
          label="Session ID"
          variant="outlined"
          required
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <Button
          onClick={generateId}
          size="small"
          style={{ textTransform: "none" }}
        >
          Random
        </Button>
      </div>
      <div style={{ width: "85%" }}>
        <TextField
          className={styles.textInput}
          id="username"
          label="User Name"
          variant="outlined"
          required
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
      </div>
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

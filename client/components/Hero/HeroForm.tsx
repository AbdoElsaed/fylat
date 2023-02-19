import { useState, useEffect } from "react";
import { doc, setDoc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { useSnackbar } from "notistack";
import styles from "@/styles/Hero.module.css";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import AddCircle from "@mui/icons-material/AddCircle";
import ArrowCircleDown from "@mui/icons-material/ArrowCircleDown";
import Button from "@mui/material/Button";
import { useRouter } from "next/router";
import { useDeviceDetect } from "@/utils/hooks";
import { db } from "@/utils/firebase";

const HeroForm = () => {
  const { enqueueSnackbar } = useSnackbar();
  const isMobile = useDeviceDetect();
  const router = useRouter();
  const { invitedSessionId } = router.query;

  const [startBtnLoading, setStartBtnLoading] = useState<boolean>(false);
  const [joinBtnLoading, setJoinBtnLoading] = useState<boolean>(false);
  const [id, setId] = useState<string>("");
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    setId((invitedSessionId as string) ?? "");
  }, [invitedSessionId]);

  const generateId = () => setId(Math.random().toString(36).slice(2));

  const createSession = async (isNew: boolean) => {
    let newSession: ISession = {
      sessionId: id,
      users: [
        {
          userName,
          type: isNew ? "admin" : "member",
        },
      ],
      files: [],
      messages: [],
    };

    try {
      const existSession = await getDoc(doc(db, "sessions", id as string));

      // if session is new and id is taken
      if (existSession.exists() && isNew) {
        setStartBtnLoading(false);
        return enqueueSnackbar("session id already taken, try another one", {
          variant: "error",
        });
      }

      // if session doesnt exist
      if (!existSession.exists() && !isNew) {
        setJoinBtnLoading(false);
        return enqueueSnackbar("No session exists with this ID", {
          variant: "error",
        });
      }

      // user joins if session exists
      if (existSession.exists() && !isNew) {
        const sessionData = existSession.data() as ISession;
        const existUser = sessionData?.users?.find(
          (u) => u.userName === userName
        );

        //if user exist
        if (existUser) {
          return router.push(
            `/session/${id}?userName=${existUser.userName}&isNew=${isNew}&role=${existUser.type}`
          );
        } else {
          // if user doesn't exist
          const newUser: IUser = {
            userName,
            type: "member",
          };
          const sessionRef = doc(db, "sessions", id);
          await updateDoc(sessionRef, {
            users: arrayUnion(newUser),
          });
        }
      }

      // create a new session
      if (!existSession.exists() && isNew) {
        await setDoc(doc(db, "sessions", id), newSession);
        // send a request to add the session to the message queue to be automatically deleted
        const res = await fetch(`http://localhost:5000/mq/session/${id}`, {
          method: "POST",
        });
        const d = await res.json();
        console.log({ d });
      }

      router.push(
        `/session/${id}?userName=${userName}&isNew=${isNew}&role=${
          isNew ? "admin" : "member"
        }`
      );
    } catch (err: any) {
      isNew ? setStartBtnLoading(false) : setJoinBtnLoading(false);
      console.error(err);
      enqueueSnackbar(err.message, { variant: "error" });
    }
  };

  const handleClick = (isNew: boolean) => {
    if (!id.trim() || !userName.trim()) {
      return enqueueSnackbar("Please fill the form!", { variant: "error" });
    }
    isNew ? setStartBtnLoading(true) : setJoinBtnLoading(true);
    createSession(isNew);
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
    >
      <Grid container spacing={2}>
        <Grid item xs={10} sx={{ display: "flex", flexDirection: "row" }}>
          <TextField
            className={styles.textInput}
            id="sessionId"
            label="Session ID"
            variant="outlined"
            required
            value={invitedSessionId ? invitedSessionId : id}
            onChange={(e) => setId(e.target.value)}
            disabled={!!invitedSessionId}
          />
          <Button
            onClick={generateId}
            size="small"
            style={{ textTransform: "none" }}
            disabled={!!invitedSessionId}
          >
            Random
          </Button>
        </Grid>
        <Grid item xs={10}>
          <TextField
            className={styles.textInput}
            id="username"
            label="User Name"
            variant="outlined"
            required
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </Grid>
      </Grid>
      <Grid container spacing={1}>
        <Grid item>
          <LoadingButton
            onClick={() => handleClick(true)}
            className={styles.btn}
            variant="contained"
            loadingPosition="end"
            endIcon={<AddCircle />}
            loading={startBtnLoading}
            disabled={!!invitedSessionId}
          >
            {isMobile ? "Start" : "Start a new session"}
          </LoadingButton>
        </Grid>
        <Grid item>
          <LoadingButton
            onClick={() => handleClick(false)}
            className={styles.btn}
            variant="outlined"
            loadingPosition="end"
            endIcon={<ArrowCircleDown />}
            loading={joinBtnLoading}
          >
            {isMobile ? "Join" : "Join an exist session"}
          </LoadingButton>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default HeroForm;

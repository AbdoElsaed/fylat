import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { Sessions } from "@/components/Sessions";
import { useBeforeUnload } from "@/hooks/userBeforeUnload";

const roles = ["admin", "member"];

const SessionsPage = ({ socket }: any) => {
  const [role, setRole] = useState<string>("");
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { setIsValidSession } = useBeforeUnload();

  const { id, isNew, userName } = router.query;

  useEffect(() => {
    socket.emit(
      "getRoleType",
      { sessionId: id, userName },
      (err: string, serverRole: string) => {
        if (err) {
          console.error(err);
          return enqueueSnackbar(err, { variant: "error" });
        }
        setRole(serverRole ? serverRole : "other");
        setIsValidSession(roles.includes(serverRole) ? true : false);
      }
    );

    socket.on("sessionIsClosed", ({ sessionId, userName: admin }: any) => {
      if (sessionId === id) {
        router.push({
          pathname: "/",
          query: { onClosedSession: sessionId },
        });
        enqueueSnackbar(`this session has been closed by admin ${admin}`, {
          variant: "success",
        });
      }
    });

    socket.on("userLeft", ({ sessionId, userName: userLeft }: any) => {
      if (sessionId === id) {
        enqueueSnackbar(`${userLeft} just left the session!`, {
          variant: "info",
        });
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, socket, userName]);

  return roles.includes(role) ? (
    <div>
      <Sessions
        role={role}
        isNew={isNew}
        userName={userName}
        id={id}
        socket={socket}
      />
    </div>
  ) : (
    <h2 style={{ color: "#777", textAlign: "center", margin: 50 }}>
      Not authorized to access this session
    </h2>
  );
};

export default SessionsPage;

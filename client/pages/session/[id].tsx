import React, { useState, useEffect } from "react";
import { Sessions } from "@/components/Sessions";
import { useRouter } from "next/router";

const SessionsPage = ({ socket }: any) => {
  const [role, setRole] = useState<string>("");
  const router = useRouter();
  const { id, isNew, userName } = router.query;

  useEffect(() => {
    socket.emit(
      "getRoleType",
      { sessionId: id, userName },
      (err: any, v: string) => {
        if (err) return console.error(err);
        setRole(v);
      }
    );
  }, [id, socket, userName]);

  const roles = ["admin", "member"];

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
  ) : null;
};

export default SessionsPage;

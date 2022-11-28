let sessions: ISession[] = [];

export const findSessionById = (sessionId: string) => {
  return sessions.find((s: ISession) => s.sessionId === sessionId);
};

export const findUser = ({ sessionId, userName }: any) => {
  let session: ISession = findSessionById(sessionId) ?? {};
  return session?.users?.find((u: IUser) => u.userName === userName);
};

export const checkSessionExist = (sessionId: string) => {
  return sessions.filter((s: any) => s.sessionId === sessionId).length
    ? true
    : false;
};

export const expireSession = (
  sessionId: string,
  expirytTime: number = 7200000,
  cb: (err: any, status: "success" | "failure") => void
) => {
  setTimeout(
    (id) => {
      console.log(sessionId, "session is expired after", expirytTime);
      sessions = sessions.filter((s: ISession) => s.sessionId !== id);
      const isExpired = !findSessionById(id);
      console.log({ isExpired });
      if (isExpired) {
        cb(null, "success");
      } else {
        cb("session isn't expired", "failure");
      }
    },
    expirytTime,
    sessionId
  );
};

export const createNewSession = ({ sessionId, user }: NewSessionParams) => {
  let session: ISession = {
    sessionId,
    users: [user],
  };
  sessions.push(session);
  return session;
};

export const addUserToSession = ({ sessionId, user }: NewSessionParams) => {
  const newSession = (findSessionById(sessionId) ?? {}) as ISession;
  newSession?.users?.push(user);

  sessions = sessions.map((s: ISession) => {
    if (s.sessionId === sessionId) {
      return newSession;
    }
    return s;
  });
};

export const isSessionAdmin = ({
  sessionId,
  socketId,
  userName,
}: IsSessionAdminParams) => {
  let { users } = (findSessionById(sessionId) ?? {}) as ISession;
  return users?.find(
    (u: IUser) =>
      u.socketId === socketId && u.userName === userName && u.type === "admin"
  )
    ? true
    : false;
};

export const getRoleType = ({
  sessionId,
  socketId,
  userName,
}: IsSessionAdminParams) => {
  const roles = ["admin", "member"];
  let { users } = (findSessionById(sessionId) ?? {}) as ISession;
  const user = users?.find(
    (u: IUser) => u.socketId === socketId && u.userName === userName
  );
  if (!user) {
    throw new Error("user not found");
  }
  return roles.includes(user?.type as string) ? user?.type : null;
};

export const removeSession = ({
  sessionId,
  socketId,
  userName,
}: RemoveSessionParams) => {
  if (!isSessionAdmin({ sessionId, socketId, userName })) {
    throw new Error("not a session admin!!");
  }
  sessions = sessions.filter((s: ISession) => s.sessionId !== sessionId);
  return sessions;
};

export const leaveSesion = ({
  sessionId,
  socketId,
  userName,
}: RemoveSessionParams) => {
  if (isSessionAdmin({ sessionId, socketId, userName })) {
    return removeSession({ sessionId, socketId, userName });
  }
  sessions = sessions.map((s: ISession) => {
    if (s.sessionId === sessionId) {
      let users = s.users?.filter((u: IUser) => u.userName !== userName);
      return {
        ...s,
        users,
      };
    }
    return s;
  });
};

export const getAllSessions = () => sessions;

export const addMsg = ({ text, sender, sessionId }: AddMsgToSessionParams) => {
  let { messages } = findSessionById(sessionId) as ISession;
  messages = [...(messages ?? []), { text, sender }];
  sessions = sessions.map((s: ISession) => {
    if (s.sessionId === sessionId) {
      return { ...s, messages };
    } else {
      return s;
    }
  });
  return messages;
};

export const getMsgsBySessionId = (sessionId: string) => {
  let { messages } = findSessionById(sessionId) as ISession;
  return messages;
};

export const addFile = ({ filename, file, sessionId }: any) => {
  let { files } = (findSessionById(sessionId) ?? {}) as ISession;
  files = [...(files ?? []), { filename, file }];
  sessions = sessions.map((s: ISession) => {
    if (s.sessionId === sessionId) {
      return { ...s, files };
    } else {
      return s;
    }
  });
  return files;
};

export const getFilesBySessionId = (sessionId: string) => {
  let { files } = findSessionById(sessionId) as ISession;
  return files;
};

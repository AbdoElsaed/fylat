let sessions: ISession[] = [];

const findSessionById = (sessionId: string) => {
  return sessions.find((s: ISession) => s.sessionId === sessionId);
};

const checkSessionExist = (sessionId: string) => {
  return sessions.filter((s: any) => s.sessionId === sessionId).length
    ? true
    : false;
};

const createNewSession = ({ sessionId, user }: NewSessionParams) => {
  let session: ISession = {
    sessionId,
    users: [user],
  };
  sessions.push(session);
  return session;
};

const addUserToSession = ({ sessionId, user }: NewSessionParams) => {
  const newSession = findSessionById(sessionId) as ISession;
  newSession.users?.push(user);

  sessions = sessions.map((s: ISession) => {
    if (s.sessionId === sessionId) {
      return newSession;
    }
    return s;
  });
};

const isSessionAdmin = ({
  sessionId,
  socketId,
  userName,
}: IsSessionAdminParams) => {
  let { users } = findSessionById(sessionId) as { users: IUser[] };
  return users.find(
    (u: IUser) =>
      u.socketId === socketId && u.userName === userName && u.type === "admin"
  )
    ? true
    : false;
};

const getRoleType = ({
  sessionId,
  socketId,
  userName,
}: IsSessionAdminParams) => {
  try {
    const roles = ["admin", "member"];
    let { users } = findSessionById(sessionId) as { users: IUser[] };
    const user = users.find(
      (u: IUser) => u.socketId === socketId && u.userName === userName
    );
    console.log({ user });
    if (!user) {
      throw new Error("user not found");
    }
    return roles.includes(user?.type as string) ? user?.type : null;
  } catch (err) {
    console.log(err);
  }
};

const removeSession = (
  { sessionId, socketId, userName }: RemoveSessionParams,
  cb: any
) => {
  try {
    if (!isSessionAdmin({ sessionId, socketId, userName })) {
      throw new Error("not an admin user!!");
    }
    sessions = sessions.filter((s: ISession) => s.sessionId !== sessionId);
    return sessions;
  } catch (err) {
    console.log(err);
    cb(err);
  }
};

const leaveSesion = (
  { sessionId, socketId, userName }: RemoveSessionParams,
  cb: any
) => {
  try {
    if (isSessionAdmin({ sessionId, socketId, userName })) {
      return removeSession({ sessionId, socketId, userName }, () => {});
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
  } catch (err) {
    console.log(err);
    cb(err);
  }
};

const getAllSessions = () => sessions;

const addMsg = ({ text, sender, sessionId }: AddMsgToSession) => {
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

const getMsgsBySessionId = (sessionId: string) => {
  let { messages } = findSessionById(sessionId) as ISession;
  return messages;
};

const addFile = ({ filename, file, sessionId }: any) => {
  let { files } = findSessionById(sessionId) as ISession;
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

const getFilesBySessionId = (sessionId: string) => {
  let { files } = findSessionById(sessionId) as ISession;
  return files;
};

module.exports = {
  getAllSessions,
  checkSessionExist,
  createNewSession,
  addUserToSession,
  isSessionAdmin,
  removeSession,
  leaveSesion,
  addMsg,
  getMsgsBySessionId,
  addFile,
  getFilesBySessionId,
  getRoleType,
};

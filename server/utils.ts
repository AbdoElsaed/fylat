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
    (u: IUser) => u.socketId === socketId && u.userName === userName
  )
    ? true
    : false;
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

module.exports = {
  getAllSessions,
  checkSessionExist,
  createNewSession,
  addUserToSession,
  isSessionAdmin,
  removeSession,
  leaveSesion,
};

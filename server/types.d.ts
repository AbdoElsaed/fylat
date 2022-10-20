interface IUser {
  userName: string;
  type: string;
  socketId: string;
}

interface IFile {
  name: string;
  data: string;
}

interface IMessage {
  userName: string;
  text: string;
}

interface ISession {
  sessionId?: string;
  users?: IUser[];
  files?: IFile[];
  messages?: IMessage[];
}

type NewSessionParams = { sessionId: string; user: IUser };

type IsSessionAdminParams = {
  sessionId: string;
  socketId: string;
  userName: string;
};

type RemoveSessionParams = {
  sessionId: string;
  socketId: string;
  userName: string;
};

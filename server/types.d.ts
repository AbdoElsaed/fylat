interface IUser {
  userName: string;
  type: string;
  socketId: string;
}

interface IFile {
  filename: string;
  file: any;
}

interface IMessage {
  sender: string;
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

type AddMsgToSession = { text: string; sender: string; sessionId: string };

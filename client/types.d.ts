interface IUser {
  userName: string;
  type: "admin" | "member";
  socketId?: string;
}

interface IFile {
  filename: string;
  storageUrl: string;
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

type AddMsgToSessionParams = {
  text: string;
  sender: string;
  sessionId: string;
};

type JSONValue = string | number | boolean | { [key: string]: JSONValue };

interface ExtendedFile extends File {
  uploaded?: boolean;
}

type FilesToUploadI = ExtendedFile[];

type UploadingFileI = {
  uploaded: boolean;
  name: string;
};

type uploadingFilesStatus = {
  [name: string]: { uploaded: boolean };
};

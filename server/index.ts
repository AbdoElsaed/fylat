import express, { Express, Request, Response } from "express";
const app: Express = express();
const http = require("http");
const server = http.createServer(app);
const { writeFile } = require("fs");
const { Server } = require("socket.io");
const { resolve } = require("path");
const {
  getAllSessions,
  checkSessionExist,
  createNewSession,
  addUserToSession,
  addMsg,
  getMsgsBySessionId,
  addFile,
  getFilesBySessionId,
  isSessionAdmin,
  getRoleType,
} = require("./utils");

const port = process.env.PORT || 8000;

const io = new Server(server, {
  maxHttpBufferSize: 1e8, // 100 MB
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.get("/", (req: Request, res: Response) => res.send("fylat backend"));

const joinSession = ({ sessionId, userName, isNew, socket }: any) => {
  //  check all session cases
  let sessionExist = checkSessionExist(sessionId);
  const sessions = getAllSessions();

  if (isNew && sessionExist) throw new Error("this session already exists!!");
  if (isNew && !sessionExist) {
    createNewSession({
      sessionId,
      user: { userName, type: "admin", socketId: socket.id },
    });
  }
  if (!isNew && sessionExist) {
    addUserToSession({
      sessionId,
      user: { userName, type: "member", socketId: socket.id },
    });
  }
  // join a session
  socket.join(sessionId);

  if (!isNew) io.to(sessionId).emit("newUserJoined", { userName });
};

io.on("connection", (socket: any) => {
  console.log("new user connected!");

  socket.on("joinSession", ({ sessionId, userName, isNew }: any, cb: any) => {
    try {
      const session = joinSession({ sessionId, userName, isNew, socket });
      console.log(`${userName} joined ${sessionId} session`);
      cb(null);
    } catch (err: any) {
      console.error(err.message);
      cb(err.message);
    }
  });

  socket.on("uploadfile", ({ files, sessionId }: any, cb: any) => {
    files.map((f: any) => {
      const { file, filename } = f;
      addFile({ filename, file, sessionId });
      // writeFile(resolve(__dirname, filename), file, (err: Error) => {
      //   cb({ message: err ? "failure" : "success" });
      // });
    });
    const allFiles = getFilesBySessionId(sessionId);
    io.to(sessionId).emit("newFileAdded", allFiles);
  });

  socket.on("sendChatMsg", ({ msg, userName, sessionId }: any, cb: any) => {
    try {
      let msgs = addMsg({ text: msg, sender: userName, sessionId });
      cb(null, msgs);
      io.to(sessionId).emit("newMsgAdded", msgs);
    } catch (err) {
      console.error(err);
      cb(err);
    }
  });

  socket.on("getInitMsgs", ({ sessionId }: any, cb: any) => {
    try {
      let msgs = getMsgsBySessionId(sessionId) ?? [];
      cb(null, msgs);
    } catch (err) {
      cb(err);
    }
  });

  socket.on("getInitFiles", ({ sessionId }: any, cb: any) => {
    try {
      let files = getFilesBySessionId(sessionId) ?? [];
      cb(null, files);
    } catch (err) {
      cb(err);
    }
  });

  socket.on("getRoleType", ({ sessionId, userName }: any, cb: any) => {
    try {
      console.log({ sessionId, userName, socketId: socket.id });
      const roleType = getRoleType({
        sessionId,
        userName,
        socketId: socket.id,
      });
      cb(null, roleType);
    } catch (err) {
      console.log(err);
      cb(err);
    }
  });
});

server.listen(port, () => {
  console.log(`listening on http://localhost:${port}`);
});

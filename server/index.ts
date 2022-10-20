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
  try {
    //  check all session cases
    let sessionExist = checkSessionExist(sessionId);
    console.log({ sessionExist });
    const sessions = getAllSessions();
    console.log({ sessions });

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
  } catch (err) {
    console.log(err);
  }
};

io.on("connection", (socket: any) => {
  console.log("new user connected!");

  socket.on("joinSession", ({ sessionId, userName, isNew }: any, cb: any) => {
    try {
      console.log(`${userName} joined ${sessionId} session`);
      const session = joinSession({ sessionId, userName, isNew, socket });
    } catch (err) {
      console.log(err);
      cb(err);
    }
  });

  socket.on("uploadfile", ({ files, sessionId }: any, cb: any) => {
    files.map((f: any) => {
      const { file, filename } = f;
      writeFile(resolve(__dirname, filename), file, (err: Error) => {
        cb({ message: err ? "failure" : "success" });
      });
    });
  });
});

server.listen(port, () => {
  console.log(`listening on http://localhost:${port}`);
});

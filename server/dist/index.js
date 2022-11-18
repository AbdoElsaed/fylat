"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const http = require("http");
const server = http.createServer(app);
const { writeFile } = require("fs");
const { Server } = require("socket.io");
const { resolve } = require("path");
const { getAllSessions, checkSessionExist, createNewSession, addUserToSession, addMsg, getMsgsBySessionId, addFile, getFilesBySessionId, } = require("./utils");
const port = process.env.PORT || 8000;
const io = new Server(server, {
    maxHttpBufferSize: 1e8,
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});
app.get("/", (req, res) => res.send("fylat backend"));
const joinSession = ({ sessionId, userName, isNew, socket }) => {
    //  check all session cases
    let sessionExist = checkSessionExist(sessionId);
    const sessions = getAllSessions();
    if (isNew && sessionExist)
        throw new Error("this session already exists!!");
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
    if (!isNew)
        io.to(sessionId).emit("newUserJoined", { userName });
};
io.on("connection", (socket) => {
    console.log("new user connected!");
    socket.on("joinSession", ({ sessionId, userName, isNew }, cb) => {
        try {
            const session = joinSession({ sessionId, userName, isNew, socket });
            console.log(`${userName} joined ${sessionId} session`);
            cb(null);
        }
        catch (err) {
            console.error(err.message);
            cb(err.message);
        }
    });
    socket.on("uploadfile", ({ files, sessionId }, cb) => {
        files.map((f) => {
            const { file, filename } = f;
            addFile({ filename, file, sessionId });
            // writeFile(resolve(__dirname, filename), file, (err: Error) => {
            //   cb({ message: err ? "failure" : "success" });
            // });
        });
        const allFiles = getFilesBySessionId(sessionId);
        io.to(sessionId).emit("newFileAdded", allFiles);
    });
    socket.on("sendChatMsg", ({ msg, userName, sessionId }, cb) => {
        try {
            let msgs = addMsg({ text: msg, sender: userName, sessionId });
            cb(null, msgs);
            io.to(sessionId).emit("newMsgAdded", msgs);
        }
        catch (err) {
            console.error(err);
            cb(err);
        }
    });
    socket.on("getInitMsgs", ({ sessionId }, cb) => {
        var _a;
        try {
            let msgs = (_a = getMsgsBySessionId(sessionId)) !== null && _a !== void 0 ? _a : [];
            cb(null, msgs);
        }
        catch (err) {
            cb(err);
        }
    });
    socket.on("getInitFiles", ({ sessionId }, cb) => {
        var _a;
        try {
            let files = (_a = getFilesBySessionId(sessionId)) !== null && _a !== void 0 ? _a : [];
            cb(null, files);
        }
        catch (err) {
            cb(err);
        }
    });
});
server.listen(port, () => {
    console.log(`listening on http://localhost:${port}`);
});

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const utils_1 = require("./utils");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
const port = process.env.PORT || 8000;
const io = new socket_io_1.Server(server, {
    maxHttpBufferSize: 1e8,
    cors: {
        origin: process.env.CLIENT_URL,
        methods: ["GET", "POST"],
    },
});
app.get("/", (req, res) => res.send("fylat backend"));
const joinSession = ({ sessionId, userName, isNew, socket }) => {
    //  check all session cases
    let sessionExist = (0, utils_1.checkSessionExist)(sessionId);
    const sessions = (0, utils_1.getAllSessions)();
    if (isNew && sessionExist)
        throw new Error("this session already exists!!");
    if (isNew && !sessionExist) {
        (0, utils_1.createNewSession)({
            sessionId,
            user: { userName, type: "admin", socketId: socket.id },
        });
        (0, utils_1.expireSession)(sessionId, 7200000, (err, status) => {
            if (status === "success") {
                io.to(sessionId).emit("sessionIsExpired", { sessionId });
            }
        });
    }
    if (!isNew && sessionExist) {
        (0, utils_1.addUserToSession)({
            sessionId,
            user: { userName, type: "member", socketId: socket.id },
        });
    }
    // join a session
    socket.join(sessionId);
    if (!isNew)
        io.to(sessionId).emit("newUserJoined", { userName, sessionId });
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
        try {
            files.map((f) => {
                const { file, filename } = f;
                (0, utils_1.addFile)({ filename, file, sessionId });
            });
            const allFiles = (0, utils_1.getFilesBySessionId)(sessionId);
            io.to(sessionId).emit("newFileAdded", allFiles);
        }
        catch (err) {
            console.error(err.message);
            cb(err.message);
        }
    });
    socket.on("sendChatMsg", ({ msg, userName, sessionId }, cb) => {
        try {
            let msgs = (0, utils_1.addMsg)({ text: msg, sender: userName, sessionId });
            cb(null, msgs);
            io.to(sessionId).emit("newMsgAdded", msgs);
        }
        catch (err) {
            console.error(err.message);
            cb(err.message);
        }
    });
    socket.on("getInitMsgs", ({ sessionId }, cb) => {
        var _a;
        try {
            let msgs = (_a = (0, utils_1.getMsgsBySessionId)(sessionId)) !== null && _a !== void 0 ? _a : [];
            cb(null, msgs);
        }
        catch (err) {
            console.error(err.message);
            cb(err.message);
        }
    });
    socket.on("getInitFiles", ({ sessionId }, cb) => {
        var _a;
        try {
            let files = (_a = (0, utils_1.getFilesBySessionId)(sessionId)) !== null && _a !== void 0 ? _a : [];
            cb(null, files);
        }
        catch (err) {
            console.error(err.message);
            cb(err.message);
        }
    });
    socket.on("getRoleType", ({ sessionId, userName }, cb) => {
        try {
            const roleType = (0, utils_1.getRoleType)({
                sessionId,
                userName,
                socketId: socket.id,
            });
            cb(null, roleType);
        }
        catch (err) {
            if (process.env.NODE_ENV !== "production") {
                require("dotenv").config();
            }
            console.error(err.message);
            cb(err.message);
        }
    });
    socket.on("removeSession", ({ sessionId, userName }, cb) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield new Promise((resolve) => resolve((0, utils_1.removeSession)({
                sessionId,
                userName,
                socketId: socket.id,
            })));
            if (!(0, utils_1.findSessionById)(sessionId)) {
                socket.to(sessionId).emit("sessionIsClosed", { sessionId, userName });
            }
            cb(null);
        }
        catch (err) {
            console.error(err.message);
            cb(err.message);
        }
    }));
    socket.on("leaveSession", ({ sessionId, userName }, cb) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield new Promise((resolve) => resolve((0, utils_1.leaveSesion)({
                sessionId,
                userName,
                socketId: socket.id,
            })));
            if (!(0, utils_1.findUser)({ sessionId, userName })) {
                socket.to(sessionId).emit("userLeft", { sessionId, userName });
            }
            cb(null);
        }
        catch (err) {
            console.error(err.message);
            cb(err.message);
        }
    }));
});
server.listen(port, () => {
    console.log(`server is listening on port ${port}`);
});
//# sourceMappingURL=index.js.map
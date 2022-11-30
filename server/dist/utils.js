"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilesBySessionId = exports.addFile = exports.getMsgsBySessionId = exports.addMsg = exports.getAllSessions = exports.leaveSesion = exports.removeSession = exports.getRoleType = exports.isSessionAdmin = exports.addUserToSession = exports.createNewSession = exports.expireSession = exports.checkSessionExist = exports.findUser = exports.findSessionById = void 0;
let sessions = [];
const findSessionById = (sessionId) => {
    return sessions.find((s) => s.sessionId === sessionId);
};
exports.findSessionById = findSessionById;
const findUser = ({ sessionId, userName }) => {
    var _a, _b;
    let session = (_a = (0, exports.findSessionById)(sessionId)) !== null && _a !== void 0 ? _a : {};
    return (_b = session === null || session === void 0 ? void 0 : session.users) === null || _b === void 0 ? void 0 : _b.find((u) => u.userName === userName);
};
exports.findUser = findUser;
const checkSessionExist = (sessionId) => {
    return sessions.filter((s) => s.sessionId === sessionId).length
        ? true
        : false;
};
exports.checkSessionExist = checkSessionExist;
const expireSession = (sessionId, expirytTime = 7200000, cb) => {
    setTimeout((id) => {
        console.log(sessionId, "session is expired after", expirytTime);
        sessions = sessions.filter((s) => s.sessionId !== id);
        const isExpired = !(0, exports.findSessionById)(id);
        console.log({ isExpired });
        if (isExpired) {
            cb(null, "success");
        }
        else {
            cb("session isn't expired", "failure");
        }
    }, expirytTime, sessionId);
};
exports.expireSession = expireSession;
const createNewSession = ({ sessionId, user }) => {
    let session = {
        sessionId,
        users: [user],
    };
    sessions.push(session);
    return session;
};
exports.createNewSession = createNewSession;
const addUserToSession = ({ sessionId, user }) => {
    var _a, _b;
    const newSession = ((_a = (0, exports.findSessionById)(sessionId)) !== null && _a !== void 0 ? _a : {});
    (_b = newSession === null || newSession === void 0 ? void 0 : newSession.users) === null || _b === void 0 ? void 0 : _b.push(user);
    sessions = sessions.map((s) => {
        if (s.sessionId === sessionId) {
            return newSession;
        }
        return s;
    });
};
exports.addUserToSession = addUserToSession;
const isSessionAdmin = ({ sessionId, socketId, userName, }) => {
    var _a;
    let { users } = ((_a = (0, exports.findSessionById)(sessionId)) !== null && _a !== void 0 ? _a : {});
    return (users === null || users === void 0 ? void 0 : users.find((u) => u.socketId === socketId && u.userName === userName && u.type === "admin"))
        ? true
        : false;
};
exports.isSessionAdmin = isSessionAdmin;
const getRoleType = ({ sessionId, socketId, userName, }) => {
    var _a;
    const roles = ["admin", "member"];
    let { users } = ((_a = (0, exports.findSessionById)(sessionId)) !== null && _a !== void 0 ? _a : {});
    const user = users === null || users === void 0 ? void 0 : users.find((u) => u.socketId === socketId && u.userName === userName);
    if (!user) {
        throw new Error("user not found");
    }
    return roles.includes(user === null || user === void 0 ? void 0 : user.type) ? user === null || user === void 0 ? void 0 : user.type : null;
};
exports.getRoleType = getRoleType;
const removeSession = ({ sessionId, socketId, userName, }) => {
    if (!(0, exports.isSessionAdmin)({ sessionId, socketId, userName })) {
        throw new Error("not a session admin!!");
    }
    sessions = sessions.filter((s) => s.sessionId !== sessionId);
    return sessions;
};
exports.removeSession = removeSession;
const leaveSesion = ({ sessionId, socketId, userName, }) => {
    if ((0, exports.isSessionAdmin)({ sessionId, socketId, userName })) {
        return (0, exports.removeSession)({ sessionId, socketId, userName });
    }
    sessions = sessions.map((s) => {
        var _a;
        if (s.sessionId === sessionId) {
            let users = (_a = s.users) === null || _a === void 0 ? void 0 : _a.filter((u) => u.userName !== userName);
            return Object.assign(Object.assign({}, s), { users });
        }
        return s;
    });
};
exports.leaveSesion = leaveSesion;
const getAllSessions = () => sessions;
exports.getAllSessions = getAllSessions;
const addMsg = ({ text, sender, sessionId }) => {
    let { messages } = (0, exports.findSessionById)(sessionId);
    messages = [...(messages !== null && messages !== void 0 ? messages : []), { text, sender }];
    sessions = sessions.map((s) => {
        if (s.sessionId === sessionId) {
            return Object.assign(Object.assign({}, s), { messages });
        }
        else {
            return s;
        }
    });
    return messages;
};
exports.addMsg = addMsg;
const getMsgsBySessionId = (sessionId) => {
    let { messages } = (0, exports.findSessionById)(sessionId);
    return messages;
};
exports.getMsgsBySessionId = getMsgsBySessionId;
const addFile = ({ filename, file, sessionId }) => {
    var _a;
    let { files } = ((_a = (0, exports.findSessionById)(sessionId)) !== null && _a !== void 0 ? _a : {});
    files = [...(files !== null && files !== void 0 ? files : []), { filename, file }];
    sessions = sessions.map((s) => {
        if (s.sessionId === sessionId) {
            return Object.assign(Object.assign({}, s), { files });
        }
        else {
            return s;
        }
    });
    return files;
};
exports.addFile = addFile;
const getFilesBySessionId = (sessionId) => {
    let { files } = (0, exports.findSessionById)(sessionId);
    return files;
};
exports.getFilesBySessionId = getFilesBySessionId;
//# sourceMappingURL=utils.js.map
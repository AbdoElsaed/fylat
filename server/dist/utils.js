"use strict";
let sessions = [];
const findSessionById = (sessionId) => {
    return sessions.find((s) => s.sessionId === sessionId);
};
const checkSessionExist = (sessionId) => {
    return sessions.filter((s) => s.sessionId === sessionId).length
        ? true
        : false;
};
const createNewSession = ({ sessionId, user }) => {
    let session = {
        sessionId,
        users: [user],
    };
    sessions.push(session);
    return session;
};
const addUserToSession = ({ sessionId, user }) => {
    var _a;
    const newSession = findSessionById(sessionId);
    (_a = newSession.users) === null || _a === void 0 ? void 0 : _a.push(user);
    sessions = sessions.map((s) => {
        if (s.sessionId === sessionId) {
            return newSession;
        }
        return s;
    });
};
const isSessionAdmin = ({ sessionId, socketId, userName, }) => {
    let { users } = findSessionById(sessionId);
    return users.find((u) => u.socketId === socketId && u.userName === userName)
        ? true
        : false;
};
const removeSession = ({ sessionId, socketId, userName }, cb) => {
    try {
        if (!isSessionAdmin({ sessionId, socketId, userName })) {
            throw new Error("not an admin user!!");
        }
        sessions = sessions.filter((s) => s.sessionId !== sessionId);
        return sessions;
    }
    catch (err) {
        console.log(err);
        cb(err);
    }
};
const leaveSesion = ({ sessionId, socketId, userName }, cb) => {
    try {
        if (isSessionAdmin({ sessionId, socketId, userName })) {
            return removeSession({ sessionId, socketId, userName }, () => { });
        }
        sessions = sessions.map((s) => {
            var _a;
            if (s.sessionId === sessionId) {
                let users = (_a = s.users) === null || _a === void 0 ? void 0 : _a.filter((u) => u.userName !== userName);
                return Object.assign(Object.assign({}, s), { users });
            }
            return s;
        });
    }
    catch (err) {
        console.log(err);
        cb(err);
    }
};
const getAllSessions = () => sessions;
const addMsg = ({ text, sender, sessionId }) => {
    let { messages } = findSessionById(sessionId);
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
const getMsgsBySessionId = (sessionId) => {
    let { messages } = findSessionById(sessionId);
    return messages;
};
const addFile = ({ filename, file, sessionId }) => {
    let { files } = findSessionById(sessionId);
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
const getFilesBySessionId = (sessionId) => {
    let { files } = findSessionById(sessionId);
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
};

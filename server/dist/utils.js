"use strict";
let sessions = [];
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
    sessions = sessions.map((s) => {
        if (s.sessionId === sessionId) {
            return Object.assign(Object.assign({}, s), { users: [...s.users, user] });
        }
        return s;
    });
};
const isSessionAdmin = ({ sessionId, socketId, userName }) => {
    let session = sessions.map((s) => s.sessionId === sessionId);
    let { users } = session;
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
            if (s.sessionId === sessionId) {
                return Object.assign({}, s);
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
module.exports = {
    getAllSessions,
    checkSessionExist,
    createNewSession,
    addUserToSession,
    isSessionAdmin,
    removeSession,
    leaveSesion,
};

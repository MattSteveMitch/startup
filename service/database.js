const MongoDB = require("mongodb");
const config = require("./dbConfig.json");
const url = "mongodb+srv://" + config.userName + ":" + config.password + "@" + config.hostname;
const myClient = new MongoDB.MongoClient(url);
const db = myClient.db("startup");

db.command({ ping: 1 }).then(() => {
    console.log("Connected to database");
}).catch((_) => { process.exit(1); });

const emails = db.collection("emails");
const sessions = db.collection("sessions");
const accounts = db.collection("accounts");
const best_scores = db.collection("best_scores");
//const pers_best_scores = new Object();
//const best_hits = [];
//const pers_best_hits = new Object();

function getEmail(email) {
    return emails.findOne({_id: email});
}

function usernameExists(username) {
    return accounts.findOne({_id: username}, {_id: 1});
}

function createAccount(username, password, email) {
    return Promise.all([
        accounts.insertOne({ _id: username, password: password, email: email, token: null }),
        emails.insertOne({ _id: email })
    ]);
}

function getAccount(username) {
    return accounts.findOne({_id: username});
}

function newSession(username, authToken) {
    return Promise.all([
        sessions.insertOne({_id: authToken, username: username}), 
        accounts.updateOne({_id: username}, {$set: {token: authToken}})
    ]);
}

function deleteSession(authToken) {
    return sessions.deleteOne({_id: authToken});
}

function getIdentity(authToken) {
    return sessions.findOne({_id: authToken}, {username: 1});
}
/*
createAccount("bro", "something", "sflsdkd");
emailExists("sflsdkd");
emails.deleteOne({ _id: "sflsdkd" });
//accounts.deleteOne({_id: "bro"});
*/
module.exports = {createAccount, getEmail: getEmail, usernameExists, getAccount, newSession, deleteSession,
    getIdentity
};
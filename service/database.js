"use strict";
import MongoDB from "mongodb";
import config from "./dbConfig.json" with {type: "json"};
const url = "mongodb+srv://" + config.userName + ":" + config.password + "@" + config.hostname;
const myClient = new MongoDB.MongoClient(url);
const db = myClient.db("startup");

db.command({ ping: 1 }).then(() => {
    console.log("Connected to database");
}).catch((_) => {
    console.log("Couldn't connect to database");
    process.exit(1);
});

const emails = db.collection("emails");
const sessions = db.collection("sessions");
const accounts = db.collection("accounts");
const score_tables = [db.collection("best_scores"),
db.collection("best_hits")];

export function getEmail(email) {
    return emails.findOne({ _id: email });
}

export function usernameExists(username) {
    return accounts.findOne({ _id: username }, { _id: 1 });
}

export function createAccount(username, password, email) {
    return Promise.all([
        accounts.insertOne({ _id: username, password: password, email: email, token: null }),
        emails.insertOne({ _id: email })
    ]);
}

export function getAccount(username) {
    return accounts.findOne({ _id: username });
}

export function newSession(username, authToken) {
    return Promise.all([
        sessions.insertOne({ _id: authToken, username: username }),
        accounts.updateOne({ _id: username }, { $set: { token: authToken } })
    ]);
}

export function deleteSession(authToken, username) {
    return Promise.all([
        sessions.deleteOne({ _id: authToken }),
        accounts.updateOne({ _id: username }, { $unset: { token: 1 } })
    ]);
}

export function getIdentity(authToken) {
    return sessions.findOne({ _id: authToken }, { username: 1 });
}

function compareOrdinals(row1, row2) {
    return row2.ordinal < row1.ordinal || -(row1.ordinal < row2.ordinal);
}

export function compareScoreRows(row1, row2) { /* To ensure that if two scores are tied, the one that was
    earned first comes first in the score table */
    let initial = row2.score < row1.score || -(row1.score < row2.score);
    if (!initial) {
        return compareOrdinals(row1, row2);
    }
    return initial;
}

export function compareScoreRowsRev(row1, row2) { // See comment on `compareScoreRows`
    let initial = row2.score > row1.score || -(row1.score > row2.score);
    if (!initial) {
        return compareOrdinals(row1, row2);
    }
    return initial;
}

function reIndex(table) { // See comment on `compareScoreRows`
    for (let i = 0; i < table.length; i++) {
        table[i].ordinal = i;
    }
}

function finalUpdateTable(collection, username, score, compareFun) {
    return new Promise((resolve, reject) => {
        collection.find({}).toArray().then((table) => {
            table.sort(compareOrdinals); /* Apparently the storage order on MongoDB is not something to 
            count on, so things might have gotten out of order at some point*/
            var old_best = table[0];

            const newRow = {ordinal: 10, username: username, score: score };
            let numRows = table.length;
            if (!numRows || compareFun(newRow, table[numRows - 1]) < 0 || table.length < 10) {
                table.push(newRow);
                table.sort(compareFun);
                reIndex(table);
                table.splice(10);

                collection.drop().then((result) => {
                    if (result) {
                        collection.insertMany(table).then((result) => {
                            resolve(old_best);
                        }).catch((error) => {
                            reject(error);
                        });
                    }
                    else {
                        console.log("Failed to drop collection");
                        reject("Failed to drop collection");
                    }
                }).catch((error) => {
                    console.log("Failed to drop collection (catch)");
                    reject(error);
                });
            }
            else {
                resolve(old_best);
            }
        }).catch((error) => {
            console.log("Failed to create array");
            reject(error);
        });
    });
}

export function updateOverallBests(username, score, is_hit) {
    let collection, compareFun;
    if (is_hit) {
        collection = score_tables[1];
        compareFun = compareScoreRowsRev;
    }
    else {
        collection = score_tables[0];
        compareFun = compareScoreRows;
    }

    return finalUpdateTable(collection, username, score, compareFun);
}

export function updatePersonalBests(username, score, is_hit) {
    let compareFun, collection_str;
    if (is_hit) {
        collection_str = "_best_hits";
        compareFun = compareScoreRowsRev;
    }
    else {
        collection_str = "_best_scores";
        compareFun = compareScoreRows;
    }
    let collection = db.collection(username + collection_str);

    return finalUpdateTable(collection, username, score, compareFun);
}

export function getScores(username, bestsOnly) {
    let pers_best_scores = db.collection(username + "_best_scores");
    let best_scores = db.collection("best_scores");
    let pers_best_hits = db.collection(username + "_best_hits");
    let best_hits = db.collection("best_hits");

    return Promise.all([
        pers_best_scores.find({}).toArray(), best_scores.find({}).toArray(),
        pers_best_hits.find({}).toArray(), best_hits.find({}).toArray()
    ]);
}

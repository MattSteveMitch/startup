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
const score_tables = [db.collection("best_scores"),
db.collection("best_hits")];

function getEmail(email) {
    return emails.findOne({ _id: email });
}

function usernameExists(username) {
    return accounts.findOne({ _id: username }, { _id: 1 });
}

function createAccount(username, password, email) {
    return Promise.all([
        accounts.insertOne({ _id: username, password: password, email: email, token: null }),
        emails.insertOne({ _id: email })
    ]);
}

function getAccount(username) {
    return accounts.findOne({ _id: username });
}

function newSession(username, authToken) {
    return Promise.all([
        sessions.insertOne({ _id: authToken, username: username }),
        accounts.updateOne({ _id: username }, { $set: { token: authToken } })
    ]);
}

function deleteSession(authToken, username) {
    return Promise.all([
        sessions.deleteOne({ _id: authToken }),
        accounts.updateOne({ _id: username }, { $unset: { token: 1 } })
    ]);
}

function getIdentity(authToken) {
    return sessions.findOne({ _id: authToken }, { username: 1 });
}

function finalUpdateTable(collection, username, score, sortOrder) {
    return new Promise((resolve, reject) => {
        collection.find({}).toArray().then((record) => {
            var old_best = record[0];
            console.log(JSON.stringify(old_best));

            record.splice(10);
            const newRow = { _id: record.length, username: username, score: score };
            console.log(JSON.stringify(newRow));
            record.push(newRow);
            resolve(collection.updateMany({}, record, { $sort: { score: sortOrder, _id: 1 } }));
        }).catch((error) => {
            reject(error);
        });
    });
}

function updateOverallBests(username, score, is_hit) {
    let collection, sortOrder;
    if (is_hit) {
        collection = score_tables[1];
        sortOrder = 1;
    }
    else {
        collection = score_tables[0];
        sortOrder = -1;
    }

    return finalUpdateTable(collection, username, score, sortOrder); // Returning a promise within a promise
}

function updatePersonalBests(username, score, is_hit) {
    let sortOrder, collection_str;
    if (is_hit) {
        collection_str = "_best_hits";
        sortOrder = 1;
    }
    else {
        collection_str = "_best_scores";
        sortOrder = -1;
    }
    let collection = db.collection(username + collection_str);

    return finalUpdateTable(collection, username, score, sortOrder); // Returning a promise within a promise
}

/*function updateScores(record, username, score, is_hit) {
    let compareFun;
    if (is_hit) {
        compareFun = compareScoreRowsRev;
    }
    else {
        compareFun = compareScoreRows;
    }

    var old_best = record[0];

    const newRow = new ScoreRow(username, score);
    record.push(newRow);
    record.sort(compareFun);
    record.splice(10);

    if (old_best) {
        return old_best.score;
    }
    else {
        return undefined;
    }
}
*/
module.exports = {
    createAccount, getEmail: getEmail, usernameExists, getAccount, newSession, deleteSession,
    getIdentity, updateOverallBests, updatePersonalBests
};
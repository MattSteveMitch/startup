const express = require("express");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const uuid = require("uuid");

const emails = new Set();
const sessions = new Object();
const accounts = new Object();
const best_scores = [];
const pers_best_scores = new Object();
const best_hits = [];
const pers_best_hits = new Object();

class ScoreRow {
    constructor(username, score) {
        this.username = username;
        this.score = score;
    }
}

const app = express();

app.use(express.json());
app.use(cookieParser());

const router = express.Router();
app.use("/api", router);
app.use(express.static("public"));

router.get("/availableEmail/:email", async (request, response) => {
    let userEmail = request.params.email;
    console.log(userEmail);
    if (emails.has(userEmail)) {
        response.status(409);
        response.send();
    }
    else {
        response.status(200);
        response.send();
    }
});

function handleGoodUsernameAPI(request, response, creatingAccount) {
    let username = request.params.username;
    let bad = ((accounts[username] !== undefined) === creatingAccount);

    if (bad) {
        response.status(404 + creatingAccount * 5);
        response.send();
    }
    else {
        response.status(200);
        response.send();
    }
}

router.get("/goodUsername/:username/login", (request, response) => {
    handleGoodUsernameAPI(request, response, false);
});

router.get("/goodUsername/:username/register", (request, response) => {
    handleGoodUsernameAPI(request, response, true);
});

router.post("/account", async (request, response) => {
    if (emails.has(request.body.email)) {
        response.status(409);
        response.send({msg: "Email already registered"});
    }
    else if (accounts[request.body.username] !== undefined) {
        response.status(409);
        response.send({msg: "Username already taken"});
    }
    else {
        emails.add(request.body.email);
        bcrypt.hash(request.body.password, 12).then((hashedPass) => {
            accounts[request.body.username] = [hashedPass, request.body.email, null];
            response.status(201);
            response.send();
        });
    }
});

function bouncer(request, response, next) {
    let username = sessions[request.cookies["authToken"]];
    if (username === undefined) {
        response.status(401);
        response.send();
    }
    else {
        request.username = username;
        next();
    }
}

function nullScoreSlayer(request, response, next) {
    let hit = request.body.score;
    if (hit === undefined || hit === null) {
        response.status(400);
        response.send();
    }
    else {
        next();
    }
}

router.post("/session", async (request, response) => {
    let account = accounts[request.body.username];
    if (account === undefined) {
        response.status(404);
        response.send();
    }
    if (account[2]) { // If the user already has an authToken; i.e. is already logged in
        delete sessions[account[2]]; // So that we don't have multiple sessions going at the same time
    }
    bcrypt.compare(request.body.password, account[0]).then((correct) => {
        if (correct) {
            response.status(201);
            let authToken = uuid.v4();
            response.cookie("authToken", authToken, {
                maxAge: 1000 * 60 * 60 * 48,
                httpOnly: true,
                sameSite: "strict",
                secure: true
            });

            sessions[authToken] = request.body.username;
            response.send();
        }
        else {
            response.status(401);
            response.send();
        }
    });
});

router.delete("/session", bouncer, (request, response) => {
    let token = request.cookies["authToken"];
    delete sessions[token];
    accounts[request.username][2] = null; // Delete authToken from account to show that user is logged out
    response.status(200);
    response.send();
});

function compareScoreRows(row1, row2) {
    return row2.score < row1.score || -(row1.score < row2.score);
}

function compareScoreRowsRev(row1, row2) {
    return row2.score > row1.score || -(row1.score > row2.score);
}

function updateScores(record, username, score, is_hit) {
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

router.post("/score", bouncer, nullScoreSlayer, (request, response) => {
    if (pers_best_scores[request.username] === undefined) {
        pers_best_scores[request.username] = [];
    }

    let score = request.body.score;
    let old_pers_best = updateScores(pers_best_scores[request.username], null, score, false);
    let old_best = updateScores(best_scores, request.username, score, false);
    let bestness = 0; // Meaning this score is not a record
    if (old_best === undefined || score < old_best) {
        bestness = 2; // Meaning this score is a new record overall
    }
    else if (old_pers_best === undefined || score < old_pers_best) {
        bestness = 1; // Meaning this score is a new personal record
    }
    response.status(201);
    response.send({bestness: bestness});
});

router.post("/hit", bouncer, nullScoreSlayer, (request, response) => {
    if (pers_best_hits[request.username] === undefined) {
        pers_best_hits[request.username] = [];
    }

    let hit = request.body.score;
    let old_pers_best = updateScores(pers_best_hits[request.username], null, hit, true);
    let old_best = updateScores(best_hits, request.username, hit, true);
    let bestness = 0; // Meaning this score is not a record
    if (old_best === undefined || hit > old_best) {
        bestness = 2; // Meaning this score is a new record overall
    }
    else if (old_pers_best === undefined || hit > old_pers_best) {
        bestness = 1; // Meaning this score is a new personal record
    }
    response.status(201);
    response.send({bestness: bestness});
});

router.get("/bests", bouncer, (request, response) => {
    let pers_best_score_record = pers_best_scores[request.username];
    let pers_best_score;
    if (pers_best_score_record) {
        pers_best_score = pers_best_score_record[0].score;
    }
    let overall_best_score = best_scores[0];
    
    let pers_best_hit_record = pers_best_hits[request.username];
    let pers_best_hit;
    if (pers_best_hit_record) {
        pers_best_hit = pers_best_hit_record[0].score;
    }
    let overall_best_hit = best_hits[0];

    response.status(200);
    response.send({
        pers_best: pers_best_score, 
        overall_best: overall_best_score,
        pers_best_hit: pers_best_hit,
        overall_best_hit: overall_best_hit
    });
});

app.use((request, response) => {
    response.sendFile(__dirname + "/public/index.html");
});

const port = process.argv.length > 2 ? process.argv[2] : 4000;
console.log("starting up server");
app.listen(port, () => {console.log("listening");});

const express = require("express");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const uuid = require("uuid");

const db = require("./database.js");

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
 //   console.log(db.emailExists(userEmail).then);
    db.getEmail(userEmail).then((result) => {
        if (result) {
            response.status(409);
            response.send();
        }
        else {
            response.status(200);
            response.send();
        }
    });
});

function handleGoodUsernameAPI(request, response, creatingAccount) {
    let username = request.params.username;
    db.usernameExists(username).then((result) => {
        let bad = (result !== null) === creatingAccount;
        if (bad) {
            response.status(404 + creatingAccount * 5);
            response.send();
        }
        else {
            response.status(200);
            response.send();
        }
    });
}

router.get("/goodUsername/:username/login", (request, response) => {
    handleGoodUsernameAPI(request, response, false);
});

router.get("/goodUsername/:username/register", (request, response) => {
    handleGoodUsernameAPI(request, response, true);
});

router.post("/account", async (request, response) => {
    db.getEmail(request.body.email).then((result) => {
        if (result) {
            response.status(409);
            response.send({ msg: "Email already registered" });
        }
        else {
            return db.usernameExists(request.body.username);
        }
    }).then((result) => {
        if (result) {
            response.status(409);
            response.send({ msg: "Username already taken" });
        }
        else {
            return bcrypt.hash(request.body.password, 12);
        }
    }).then((hashedPass) => {
        return db.createAccount(request.body.username, hashedPass, request.body.email);
    }).then((result) => {
        response.status(201);
        response.send();
    });
});

function bouncer(request, response, next) {
    db.getIdentity(request.cookies["authToken"]).then((result) => {
        if (!result) {
            response.status(401);
            response.send();
        }
        else {
            request.username = result.username;
            next();
        }
    });
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

function checkLogin(request, response, next) {
    db.getAccount(request.body.username).then((account) => {
        if (!account) {
            response.status(404);
            response.send();
        }
        var comparisonPromise = bcrypt.compare(request.body.password, account.password);
        if (account.token) { // If somehow the user is already logged in, log them out first
            return Promise.all([db.deleteSession(account.token), comparisonPromise]);
        }
        else {
            return comparisonPromise;
        }
    }).then((result) => {
        if (result[1] ?? result) {
            next();
        }
        else {
            response.status(401);
            response.send();
        }
    });
}

router.post("/session", checkLogin, async (request, response) => {
    let authToken = uuid.v4();
    response.cookie("authToken", authToken, {
        maxAge: 1000 * 60 * 60 * 48,
        httpOnly: true,
        sameSite: "strict",
        secure: true
    });

    db.newSession(request.body.username, authToken).then((result) => {
        console.log(JSON.stringify(result));
        response.status(201);
        response.send();
    }).catch((error) => {
        console.log(JSON.stringify(error));
        response.status(500);
        response.send();
    });

});

router.delete("/session", bouncer, (request, response) => {
    let token = request.cookies["authToken"];
    delete sessions[token];
    accounts[request.username][2] = null; // Delete authToken from account to show that user is logged out
    response.status(200);
    response.send();
});

router.get("/xkcd/:number", (request, response) => {
    fetch(
        "https://xkcd.com/" + request.params.number + "/info.0.json",
        {
            method: "get",
            headers: { "Content-type": "application/json; charset=UTF-8" }
        }
    ).then((xkcd_response) => {
        if (xkcd_response.status === 200) {
            xkcd_response.json().then((body) => {
                response.status(200);
                response.send({ url: body.img });
            });
        }
        else {
            response.status(xkcd_response.status);
            response.send();
        }
    });
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
    response.send({ bestness: bestness });
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
    response.send({ bestness: bestness });
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

router.get("/scores", bouncer, (request, response) => {
    let pers_best_score_record = pers_best_scores[request.username];
    let pers_best_hit_record = pers_best_hits[request.username];

    response.status(200);
    response.send({
        pers_bests: pers_best_score_record,
        overall_bests: best_scores,
        pers_best_hits: pers_best_hit_record,
        overall_best_hits: best_hits
    });
});

app.use((request, response) => {
    response.sendFile(__dirname + "/public/index.html");
});

const port = process.argv.length > 2 ? process.argv[2] : 4000;
console.log("starting up server");
app.listen(port, () => { console.log("listening"); });

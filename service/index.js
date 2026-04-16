const express = require("express");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const uuid = require("uuid");

const db = require("./database.js");

const app = express();

app.use(express.json());
app.use(cookieParser());

const router = express.Router();
app.use("/api", router);
app.use(express.static("public"));

router.get("/availableEmail/:email", async (request, response) => {
    let userEmail = request.params.email;
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
        if (result === undefined) {
        }
        else if (result) {
            response.status(409);
            response.send({ msg: "Username already taken" });
        }
        else {
            return bcrypt.hash(request.body.password, 12);
        }
    }).then((hashedPass) => {
        if (hashedPass !== undefined) {
            return db.createAccount(request.body.username, hashedPass, request.body.email);
        }
    }).then((result) => {
        if (result !== undefined) {
            response.status(201);
            response.send();
        }
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
    let score = request.body.score;
    if (score === undefined || score === null) {
        response.status(400);
        response.send();
    }
    else {
        next();
    }
}

function checkLogin(request, response, next) {
    var username = request.body.username;
    var existingToken;
    db.getAccount(username).then((account) => {
        if (!account) {
            response.status(404);
            response.send();
        }
        else {
            existingToken = account.token;
            return bcrypt.compare(request.body.password, account.password);
        }
    }).then((correct) => {
        if (correct === undefined) {
        }
        else if (correct) {
            if (existingToken) {
                return db.deleteSession(existingToken, username);
            }
            else {
                next();
            }
        }
        else {
            response.status(401);
            response.send();
        }
    }).then((result) => {
        if (result !== undefined) {
            /* If `result` is undefined, it means either we've failed one of
            the previous conditions, or we've already called `next()` */
            next();
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
    db.deleteSession(token, request.username).then((result) => {
        response.status(200);
        response.send();
    });
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

router.post("/score", bouncer, nullScoreSlayer, (request, response) => {
    let score = request.body.score;
    Promise.all([
        db.updateOverallBests(request.username, score, false),
        db.updatePersonalBests(request.username, score, false)
    ]).then((old_bests) => {
        let old_overall_best = old_bests[0];
        let old_pers_best = old_bests[1];
        let bestness = 0; // Meaning this score is not a record
        if (old_overall_best === undefined || score < old_overall_best.score) {
            bestness = 2; // Meaning this score is a new record overall
        }
        else if (old_pers_best === undefined || score < old_pers_best.score) {
            bestness = 1; // Meaning this score is a new personal record
        }
        response.status(201);
        response.send({ bestness: bestness });
    }).catch((error) => {
        console.log(JSON.stringify(error));
    });
});

router.post("/hit", bouncer, nullScoreSlayer, (request, response) => {
    let score = request.body.score;
    Promise.all([
        db.updateOverallBests(request.username, score, true),
        db.updatePersonalBests(request.username, score, true)
    ]).then((old_bests) => {
        let old_overall_best = old_bests[0];
        let old_pers_best = old_bests[1];
        let bestness = 0; // Meaning this score is not a record
        if (old_overall_best === undefined || score > old_overall_best.score) {
            bestness = 2; // Meaning this score is a new record overall
        }
        else if (old_pers_best === undefined || score > old_pers_best.score) {
            bestness = 1; // Meaning this score is a new personal record
        }
        response.status(201);
        response.send({ bestness: bestness });
    }).catch((error) => {
        console.log(JSON.stringify(error));
    });
});

router.get("/bests", bouncer, (request, response) => {
    db.getScores(request.username, true).then((bests) => {
        let pers_best_row = bests[0][0];
        let pers_best_hit_row = bests[2][0];
        let pers_best, pers_best_hit;
        if (pers_best_row) {
            pers_best = pers_best_row.score;
        }
        else {
            pers_best = undefined;
        }

        if (pers_best_hit_row) {
            pers_best_hit = pers_best_hit_row.score;
        }
        else {
            pers_best_hit = undefined;
        }

        response.status(200);
        response.send({
            pers_best: pers_best,
            overall_best: bests[1][0],
            pers_best_hit: pers_best_hit,
            overall_best_hit: bests[3][0]
        });
    });
});

router.get("/scores", bouncer, (request, response) => {
    db.getScores(request.username, false).then((bests) => {
        response.status(200);
        response.send({
            pers_bests: bests[0],
            overall_bests: bests[1],
            pers_best_hits: bests[2],
            overall_best_hits: bests[3]
        });
    });
});

app.use((request, response) => {
    response.sendFile(__dirname + "/public/index.html");
});

const port = process.argv.length > 2 ? process.argv[2] : 4000;
console.log("starting up server");
app.listen(port, () => { console.log("listening"); });

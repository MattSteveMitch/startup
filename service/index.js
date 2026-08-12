"use strict";
import express from "express";
import cookieParser from "cookie-parser";
import bcrypt from "bcryptjs";
import * as uuid from "uuid";
import path from "path";
import * as ws from "ws";
import child_process from "node:child_process";

import * as db from "./database.js";

const port = 4000;

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

function verifyLength(request, response, next) {
    if (request.body.email.length > 60) {
        response.status(400);
        response.send({ msg: "Email too long" });
    }
    else if (request.body.username.length > 16) {
        response.status(400);
        response.send({ msg: "Username too long" });
    }
    else if (request.body.password.length > 16) {
        response.status(400);
        response.send({ msg: "Password too long" });
    }
    else {
        next();
    }
}

router.post("/account", verifyLength, async (request, response) => {
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

function checkNotNull(score) {
    if (score === undefined || score === null) {
        console.log("Error! Score value is null");
        return false;
    }
    return true;
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

function getBestness(old_bests, score, is_hit) {
    let old_overall_best = old_bests[0];
    let old_pers_best = old_bests[1];
    if (
        old_overall_best === undefined ||
        ((!is_hit && score < old_overall_best.score) || (is_hit && score > old_overall_best.score))
    ) {
        return 2; // Meaning this score is a new record overall
    }
    else if (
        old_pers_best === undefined ||
        ((!is_hit && score < old_pers_best.score) || (is_hit && score > old_pers_best.score))
    ) {
        return 1; // Meaning this score is a new personal record
    }

    return 0; // Meaning this score is not a record
}

function newScoreHandler(authToken, score, is_hit) {
    return new Promise((resolve, reject) => {
        db.getIdentity(authToken).then((result) => {
            if (!result) {
                reject("Player not logged in");
            }
            else {
                var username = result.username;
                Promise.all([
                    db.updateOverallBests(username, score, is_hit),
                    db.updatePersonalBests(username, score, is_hit)
                ]).then((old_bests) => {
                    resolve(old_bests);
                }).catch((error) => {
                    reject("Error updating score: is_hit = " + is_hit);
                });
            }
        });
    });
}

/*router.post("/score", bouncer, nullScoreSlayer, (request, response) => {
    newScoreHandler(request, response, false);
});

router.post("/hit", bouncer, nullScoreSlayer, (request, response) => {
    newScoreHandler(request, response, true);
});*/

function sortAll(scores) {
    scores[0].sort(db.compareScoreRows);
    scores[1].sort(db.compareScoreRows);
    scores[2].sort(db.compareScoreRowsRev);
    scores[3].sort(db.compareScoreRowsRev);
}

router.get("/bests", bouncer, (request, response) => {
    db.getScores(request.username, true).then((bests) => {
        sortAll(bests);

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
        sortAll(bests);

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
    response.sendFile(path.resolve() + "/public/index.html");
});

const httpServer = app.listen(port);

const wsServer = new ws.WebSocketServer({server: httpServer});

//let pyProc = child_process.spawn("python", ["Starsight - win.py"]);
//pyProc.stdout.on("data", (message) => {console.log(message.toString());});
const bestnessSymbols = [["$", "+", "!"], ["*", "#", "@"]];

function getAuthToken(request) {
    let cookies = request.headers.cookie;
    let beginInd = cookies.search("authToken=") + 10;
    let endInd = cookies.slice(beginInd).search(";");
    let authToken = endInd === -1 ? 
        cookies.slice(beginInd) : cookies.slice(beginInd, beginInd + endInd);
    return authToken;
}

wsServer.on("connection", (client, request) => {
    client.authToken = getAuthToken(request);

    client.pyProc = child_process.spawn("python3", ["Starsight.py"]);
    client.pyProc.stdout.on("data", (message) => {
        client.send(message.toString());
    });

    client.pyProc.stderr.on("data", (data) => {
        let message = data.toString();
        //console.log(message);
        let is_hit, score;
        if (message[0] === "S") {
            is_hit = false;
            score = parseInt(message.slice(1));
        }
        else if (message[0] === "H") {
            is_hit = true;
            score = parseFloat(message.slice(1));
        }
        else {return;}

        newScoreHandler(client.authToken, score, is_hit).then((old_bests) => {
            let bestness = getBestness(old_bests, score, is_hit);

            let symbol = bestnessSymbols[+is_hit][bestness];
            let scoreStr = is_hit ? 
                Math.round(score * 10).toString(36) : score.toString(36);
            client.send(symbol + scoreStr);
        }).catch((error) => {
            console.log(error);
        });
    });

    client.on("message", (data) => {
        client.pyProc.stdin.write(data.toString());
    });

    client.on("close", (_) => {
        client.pyProc.stdin.write("q\n"); // Send signal to end program
        console.log("Closed Python");
    });
});

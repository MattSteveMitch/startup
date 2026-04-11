const express = require("express");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const uuid = require("uuid");

const emails = new Set();
const usernames = new Object();
const accounts = new Object();

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

router.post("/session", async (request, response) => {
    let account = accounts[request.body.username];
    if (account === undefined) {
        response.status(404);
        response.send();
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
            usernames[authToken] = request.body.username;
            response.send();
        }
        else {
            response.status(401);
            response.send();
        }
    });
});

app.use((request, response) => {
    response.sendFile("/public/index.html");
});

const port = process.argv.length > 2 ? process.argv[2] : 4000;
console.log("starting up server");
app.listen(port, () => {console.log("listening");});

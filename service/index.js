const express = require("express");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

const router = express.Router();
app.use("/api", router);

const authTokens = Object();

const emails = new Set();
const usernames = new Set();
const accounts = new Object();

console.log("starting up server");

router.get("/validEmail/:email", async (request, result) => {
    let userEmail = request.params.email;
    console.log(userEmail);
    if (emails.has(userEmail)) {
        result.status(409);
        result.send();
    }
    else {
        result.status(200);
        result.send();
    }
});

router.get("/validUsername/:username", async (request, result) => {
    let username = request.params.username;
    if (usernames.has(username)) {
        result.status(409);
        result.send();
    }
    else {
        result.status(200);
        result.send();
    }
});

router.post("/account", async (request, result) => {
    if (emails.has(request.body.email)) {
        result.status(409);
        result.send({msg: "Email already registered"});
    }
    else if (usernames.has(request.body.username)) {
        result.status(409);
        result.send({msg: "Username already taken"});
    }
    else {
        emails.add(request.body.email);
        usernames.add(request.body.username);
        console.log("checkpoint");
        bcrypt.hash(request.body.password, 12).then(
            (hashedPass) => {
                console.log("checkpoint 2");
                accounts[request.body.username] = [hashedPass, request.body.email];
                result.status(201);
                result.send();
            }
        );
    }
});

const port = process.argv.length > 2 ? process.argv[2] : 4000;
app.listen(port, () => {console.log("listening");});

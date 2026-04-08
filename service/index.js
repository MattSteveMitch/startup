const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();

//app.use(cookieParser());
//app.use(express.static('public'));

const router = express.Router();
app.use("/api", router);

const authTokens = Object();

const emails = new Set();
const usernames = new Set(["joe"]);
let n = 0;
console.log("starting up server");

router.get("/validEmail/:email", async (request, result) => {
    let userEmail = request.params.email;
    console.log(userEmail);
  //  console.log(emails);
    if (emails.has(userEmail)) {
        result.status(409);
        result.send();
    }
    else {
      //  console.log("got request " + n);
        result.status(200);
        result.send();
    }
});

router.get("/validUsername/:username", async (request, result) => {
    let username = request.params.username;
    console.log(username);
  //  console.log(emails);
    if (usernames.has(username)) {
        result.status(409);
        result.send();
    }
    else {
      //  console.log("got request " + n);
        result.status(200);
        result.send();
    }
});

const port = process.argv.length > 2 ? process.argv[2] : 4000;
app.listen(port, () => {console.log("listening");});
/*
function notEmpty(fields, emptyMsgs, index, errorMsgRef) {
    if (!fields[index]) {
        errorMsgRef.current.innerHTML = emptyMsgs[index];
        errorMsgRef.current.className = "errorMsg bad";
        return false;
    }

    return true;
}

export function checkUniqueEmail(fields, emptyMsgs, errorMsgRef) {
    if (!notEmpty(fields, emptyMsgs, 0, errorMsgRef)) {
    }
    else if (!localStorage.getItem(fields[0] + "_email_taken")) {
        errorMsgRef.current.innerHTML = "";
        errorMsgRef.current.className = "errorMsg good";
        return true;
    }
    else {
        errorMsgRef.current.innerHTML = "This email already has an account";
        errorMsgRef.current.className = "errorMsg bad";
    }
    return false;
}

export function checkUniqueUsername(fields, emptyMsgs, errorMsgRef) {
//    The reason why I do all the previous check along with the current check, even if 
  //  the previous checks have already been done, is because I want the error messages 
    //from the first fields that you fill out to have priority. I'm a little nitpicky 
    //like that.
    if (!checkUniqueEmail(fields, emptyMsgs, errorMsgRef) ||
        !notEmpty(fields, emptyMsgs, 1, errorMsgRef)) {
    }
    else if (!localStorage.getItem(fields[1] + "_password")) {
        errorMsgRef.current.innerHTML = "Username available";
        errorMsgRef.current.className = "errorMsg good";
        return true;
    }
    else {
        errorMsgRef.current.innerHTML = "Username already taken";
        errorMsgRef.current.className = "errorMsg bad";
        return false;
    }
}

export function checkRegPassword(fields, emptyMsgs, errorMsgRef) {
    // See previous comment
    if (!checkUniqueUsername(fields, emptyMsgs, errorMsgRef) || 
        !notEmpty(fields, emptyMsgs, 2, errorMsgRef)) {
            return false;
    }
    clearError(errorMsgRef);

    return true;
}

export function checkPasswordsMatch(fields, emptyMsgs, errorMsgRef) {
    // See previous comment
    if (!checkRegPassword(fields, emptyMsgs, errorMsgRef) || 
        !notEmpty(fields, emptyMsgs, 3, errorMsgRef)) {
    }
    else if (fields[2] === fields[3]) {
        errorMsgRef.current.innerHTML = "Passwords match";
        errorMsgRef.current.className = "errorMsg good";
        return true;
    }
    else {
        errorMsgRef.current.innerHTML = "Passwords don't match";
        errorMsgRef.current.className = "errorMsg bad";
    }
    return false;
}

export function attemptCreateAccount(fields, emptyMsgs, errorMsgRef) {
    // See previous comment
    if (checkPasswordsMatch(fields, emptyMsgs, errorMsgRef)) {
        localStorage.setItem(fields[1] + "_password", fields[2]);
        localStorage.setItem(fields[0] + "_email_taken", "t");
        document.location.href = "/";
    }
}

export function checkValidUsername(fields, emptyMsgs, errorMsgRef) {
    if (!notEmpty(fields, emptyMsgs, 0, errorMsgRef)) {
    }
    else if (localStorage.getItem(fields[0] + "_password")) {
        errorMsgRef.current.innerHTML = "Username valid";
        errorMsgRef.current.className = "errorMsg good";
        return true;
    }
    else {
        errorMsgRef.current.innerHTML = "Username invalid";
        errorMsgRef.current.className = "errorMsg bad";
    }
    return false;
}

export function checkLoginPassword(fields, emptyMsgs, errorMsgRef) {
    if (!checkValidUsername(fields, emptyMsgs, errorMsgRef) ||
        !notEmpty(fields, emptyMsgs, 1, errorMsgRef)) {
            return false;
    }
    clearError(errorMsgRef);

    return true;
}

export function submitLoginInfo(fields, emptyMsgs, errorMsgRef) {
    var real_password;
    if (checkLoginPassword(fields, emptyMsgs, errorMsgRef)) {
        real_password = localStorage.getItem(fields[0] + "_password");

        if (fields[1] === real_password) {
            localStorage.setItem("username", fields[0]);
            document.location.href = "/game";
        }
        else {
            errorMsgRef.current.innerHTML = "Invalid password";
            errorMsgRef.current.className = "errorMsg bad";
        }
    }
}

export function clearError(errorMsgRef) {
    errorMsgRef.current.innerHTML = "";
    errorMsgRef.current.className = "errorMsg good";
}
*/
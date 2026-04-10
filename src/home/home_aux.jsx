const emailsCache = Object();
const usernamesCache = Object();

function notEmpty(fields, emptyMsgs, index, errorMsgRef) {
    if (!fields[index]) {
        errorMsgRef.current.innerHTML = emptyMsgs[index];
        errorMsgRef.current.className = "errorMsg bad";
        return false;
    }

    return true;
}

function setErrMsg(errorMsgRef, msg, isGood) {
    errorMsgRef.current.innerHTML = msg;
    if (isGood) {
        errorMsgRef.current.className = "errorMsg good";
    }
    else {
        errorMsgRef.current.className = "errorMsg bad";
    }
}

export function checkUniqueEmail(fields, emptyMsgs, errorMsgRef) {
    let failMsg = "This email already has an account";

    return new Promise((resolve, reject) => {
        if (notEmpty(fields, emptyMsgs, 0, errorMsgRef)) {
            var cachedResult = emailsCache[fields[0]];
            if (cachedResult === undefined) {
                fetch("/api/availableEmail/" + fields[0], {
                    method: "get",
                    headers: { "Content-type": "application/json; charset=UTF-8", }
                }).then(
                    (response) => {
                        switch (response.status) {
                            case 200:
                                setErrMsg(errorMsgRef, "", true);
                                emailsCache[fields[0]] = true;
                                resolve(true);
                                break;
                            case 409:
                                setErrMsg(errorMsgRef, failMsg, false);
                                emailsCache[fields[0]] = false;
                                resolve(false);
                                break;
                            default:
                                console.log(response);
                                resolve(false);
                        }
                    }
                );
            }
            else if (cachedResult === true) {
                setErrMsg(errorMsgRef, "", true);
                resolve(true);
            }
            else if (cachedResult === false) {
                setErrMsg(errorMsgRef, failMsg, false);
                resolve(false);
            }
            else {
                setErrMsg(errorMsgRef, "Unexpected cache result", false)
            }
        }
        else {
            resolve(false);
        }
    });
}

export function checkUniqueUsername(fields, emptyMsgs, errorMsgRef) {
    /* The reason why I do all the previous check along with the current check, even if 
    the previous checks have already been done, is because I want the error messages 
    from the first fields that you fill out to have priority. I'm a little nitpicky 
    like that.*/
    let successMsg = "Username available";
    let failMsg = "Username already taken";

    return new Promise((resolve, reject) => {
        checkUniqueEmail(fields, emptyMsgs, errorMsgRef).then(
            (result) => {
                if (result === true) {
                    if (notEmpty(fields, emptyMsgs, 1, errorMsgRef)) {
                        var cachedResult = usernamesCache[fields[1]];
                        if (cachedResult === undefined) {
                            fetch("/api/goodUsername/" + fields[1] + "/register", {
                                method: "get",
                                headers: { "Content-type": "application/json; charset=UTF-8", }
                            }).then(
                                (response) => {
                                    switch (response.status) {
                                        case 200:
                                            setErrMsg(errorMsgRef, successMsg, true);
                                            usernamesCache[fields[1]] = true;
                                            resolve(true);
                                            break;
                                        case 409:
                                            setErrMsg(errorMsgRef, failMsg, false);
                                            usernamesCache[fields[1]] = false;
                                            resolve(false);
                                            break;
                                        default:
                                            setErrMsg(errorMsgRef, "Unexpected server response", false);
                                            console.log(response);
                                    }
                                }
                            );
                        }
                        else if (cachedResult === true) {
                            setErrMsg(errorMsgRef, successMsg, true);
                            resolve(true);
                        }
                        else if (cachedResult === false) {
                            setErrMsg(errorMsgRef, failMsg, false);
                            resolve(false);
                        }
                        else {
                            setErrMsg(errorMsgRef, "Unexpected cache result", false)
                        }
                    }
                    else {
                        resolve(false);
                    }
                }
                else {
                    resolve(false);
                }
            }
        );
    });
}

export function checkRegPassword(fields, emptyMsgs, errorMsgRef) {
    // See previous comment
    return new Promise((resolve, reject) => {
        checkUniqueUsername(fields, emptyMsgs, errorMsgRef).then(
            (result) => {
                if (result === true) {
                    if (notEmpty(fields, emptyMsgs, 2, errorMsgRef)) {
                        clearError(errorMsgRef);
                        resolve(true);
                    }
                    else {
                        resolve(false);
                    }
                }
                else {
                    resolve(false);
                }
            }
        );
    });
}

export function checkPasswordsMatch(fields, emptyMsgs, errorMsgRef) {
    // See previous comment
    return new Promise((resolve, reject) => {
        checkRegPassword(fields, emptyMsgs, errorMsgRef).then(
            (result) => {
                if (result === true) {
                    if (notEmpty(fields, emptyMsgs, 2, errorMsgRef)) {
                        if (fields[2] === fields[3]) {
                            setErrMsg(errorMsgRef, "Passwords match", true);
                            resolve(true);
                        }
                        else {
                            setErrMsg(errorMsgRef, "Passwords don't match", false);
                            resolve(false);
                        }
                    }
                    else {
                        resolve(false);
                    }
                }
                else {
                    resolve(false);
                }
            }
        );
    });
}

export function attemptCreateAccount(fields, emptyMsgs, errorMsgRef) {
    // See previous comment
    checkPasswordsMatch(fields, emptyMsgs, errorMsgRef).then((result) => {
        if (result === true) {
            fetch("/api/account", {
                method: "post",
                body: JSON.stringify({ email: fields[0], username: fields[1], password: fields[2] }),
                headers: { "Content-type": "application/json; charset=UTF-8", }
            }).then((result) => {
                console.log(result.body);
                if (result.status === 201) {
                    setErrMsg(errorMsgRef, "Account successfully created", true);
                    document.location.href = "/";
                }
                else if (result.status === 409) {
                    setErrMsg(errorMsgRef, result.body.msg, false);
                }
                else {
                    setErrMsg(errorMsgRef, "Unexpected server response", false);
                }
            });
        }
    });
}

export function checkValidUsername(fields, emptyMsgs, errorMsgRef) {
    return new Promise((resolve, reject) => {
        if (notEmpty(fields, emptyMsgs, 0, errorMsgRef)) {
            fetch("/api/goodUsername/" + fields[0] + "/login", {
                method: "get",
                headers: { "Content-type": "application/json; charset=UTF-8", }
            }).then((result) => {
                if (result.status === 200) {
                    setErrMsg(errorMsgRef, "Username valid", true);
                    resolve(true);
                }
                else if (result.status === 404) {
                    setErrMsg(errorMsgRef, "Username invalid", false);
                    resolve(false);
                }
                else {
                    setErrMsg(errorMsgRef, "Unexpected server response", false);
                }
            });
        }
        else {
            resolve(false);
        }
    });
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
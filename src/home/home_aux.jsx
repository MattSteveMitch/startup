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

export function checkUniqueEmail(fields, emptyMsgs, errorMsgRef) {
    function setMessage(goodEmail) {
        if (goodEmail) {
            errorMsgRef.current.innerHTML = "";
            errorMsgRef.current.className = "errorMsg good";
        }
        else {
            errorMsgRef.current.innerHTML = "This email already has an account";
            errorMsgRef.current.className = "errorMsg bad";
        }
    }

    return new Promise((resolve, reject) => {
        if (notEmpty(fields, emptyMsgs, 0, errorMsgRef)) {
            var cachedResult = emailsCache[fields[0]];
            if (cachedResult === undefined) {
                fetch("/api/validEmail/" + fields[0], {
                    method: "get",
                    headers: { "Content-type": "application/json; charset=UTF-8", }
                }).then(
                    (response) => {
                        switch (response.status) {
                            case 200:
                                setMessage(true);
                                emailsCache[fields[0]] = true;
                                resolve(true);
                                break;
                            case 409:
                                setMessage(false);
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
                setMessage(true);
                resolve(true);
            }
            else if (cachedResult === false) {
                setMessage(false);
                resolve(false);
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
    function setMessage(goodUsername) {
        if (goodUsername) {
            errorMsgRef.current.innerHTML = "Username available";
            errorMsgRef.current.className = "errorMsg good";
        }
        else {
            errorMsgRef.current.innerHTML = "Username already taken";
            errorMsgRef.current.className = "errorMsg bad";
        }
    }

    return new Promise((resolve, reject) => {
        checkUniqueEmail(fields, emptyMsgs, errorMsgRef).then(
            (result) => {
                if (result === true) {
                    if (notEmpty(fields, emptyMsgs, 1, errorMsgRef)) {
                        var cachedResult = usernamesCache[fields[1]];
                        if (cachedResult === undefined) {
                            fetch("/api/validUsername/" + fields[1], {
                                method: "get",
                                headers: { "Content-type": "application/json; charset=UTF-8", }
                            }).then(
                                (response) => {
                                    switch (response.status) {
                                        case 200:
                                            setMessage(true);
                                            usernamesCache[fields[1]] = true;
                                            resolve(true);
                                            break;
                                        case 409:
                                            setMessage(false);
                                            usernamesCache[fields[1]] = false;
                                            resolve(false);
                                            break;
                                        default:
                                            console.log(response);
                                    }
                                }
                            );
                        }
                        else if (cachedResult === true) {
                            setMessage(true);
                            resolve(true);
                        }
                        else if (cachedResult === false) {
                            setMessage(false);
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
                            errorMsgRef.current.innerHTML = "Passwords match";
                            errorMsgRef.current.className = "errorMsg good";
                            resolve(true);
                        }
                        else {
                            errorMsgRef.current.innerHTML = "Passwords don't match";
                            errorMsgRef.current.className = "errorMsg bad";
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
                body: JSON.stringify({email: fields[0], username: fields[1], password: fields[2]}),
                headers: { "Content-type": "application/json; charset=UTF-8", }
            }).then((result) => {
                console.log(result.body);
                if (result.status === 201) {
                    document.location.href = "/";
                }
            });
        }
    });
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
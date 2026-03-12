export function checkNotEmpty(fields, emptyMsgs, upTo, errorMsgRef) {
    for (let i = 0; i < upTo; i++) {
        if (!fields[i]) {
            errorMsgRef.current.innerHTML = emptyMsgs[i];
            errorMsgRef.current.className = "errorMsg bad";
            return false;
        }
    }
    
    return true;
}

export function checkUniqueUsername(fields, emptyMsgs, errorMsgRef) {
    if (!checkNotEmpty(fields, emptyMsgs, 2, errorMsgRef)) {
        return;
    }

    if (!localStorage.getItem(username + "_password")) {
        errorMsgRef.current.innerHTML = "Username available";
        errorMsgRef.current.className = "errorMsg good";
    }
    else {
        errorMsgRef.current.innerHTML = "Username already taken";
        errorMsgRef.current.className = "errorMsg bad";
    }
}

export function checkUniqueEmail(fields, emptyMsgs, errorMsgRef) {
    if (!checkNotEmpty(fields, emptyMsgs, 1, errorMsgRef)) {
        return;
    }

    if (!localStorage.getItem(fields[0] + "_email_taken")) {
        errorMsgRef.current.innerHTML = "";
        errorMsgRef.current.className = "errorMsg good";
    }
    else {
        errorMsgRef.current.innerHTML = "Account already associated with this email";
        errorMsgRef.current.className = "errorMsg bad";
    }
}

export function checkValidUsername(username, errorMsgRef) {
    if (!checkNotEmpty(username, errorMsgRef, "Must enter username")) {
        return;
    }

    if (localStorage.getItem(username + "_password")) {
        errorMsgRef.current.innerHTML = "Username: Valid";
        errorMsgRef.current.className = "errorMsg good";
    }
    else {
        errorMsgRef.current.innerHTML = "Username: Invalid";
        errorMsgRef.current.className = "errorMsg bad";
    }
}

export function checkPasswordsMatch(pass1, pass2, errorMsgRef) {
    if (!checkNotEmpty(pass1, errorMsgRef, "Must enter password") ||
        !checkNotEmpty(pass2, errorMsgRef, "Must confirm password")) {
        return;
    }

    if (pass1 == pass2) {
        errorMsgRef.current.innerHTML = "Passwords match";
        errorMsgRef.current.className = "errorMsg good";
    }
    else {
        errorMsgRef.current.innerHTML = "Passwords don't match";
        errorMsgRef.current.className = "errorMsg bad";
    }
}

export function submitLoginInfo(username, password, errorMsgRef) {
    var real_password = localStorage.getItem(username + "_password");
    if (real_password) {
        if (password == real_password) {
            localStorage.setItem("username", username);
        }
    }
    else {
        errorMsgRef.current.innerHTML = "Invalid username";
        errorMsgRef.current.className = "errorMsg bad";
    }
}

export function attemptCreateAccount(email, username, password1, password2, errorMsgRef) {
    if (!checkNotEmpty(email, errorMsgRef, "Must enter email") ||
        !checkNotEmpty(username, errorMsgRef, "Must enter username") ||
        !checkNotEmpty(password1, errorMsgRef, "Must enter password") ||
        !checkNotEmpty(password2, errorMsgRef, "Must confirm password")) {
        return;
    }

    else if (localStorage.getItem(email + "_email_taken")) {
        errorMsgRef.current.innerHTML = "Account already associated with this email";
        errorMsgRef.current.className = "errorMsg bad";
    }
    else if (localStorage.getItem(username + "_password")) {
        errorMsgRef.current.innerHTML = "Username already taken";
        errorMsgRef.current.className = "errorMsg bad";
    }
    else if (password1 != password2) {
        errorMsgRef.current.innerHTML = "Passwords don't match";
        errorMsgRef.current.className = "errorMsg bad";
    }
    else {
        localStorage.setItem(username + "_password", password1);
        localStorage.setItem(email + "_email_taken", "t");
        document.location.href = "/";
    }
}
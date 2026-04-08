import React from "react";
import { NavLink } from "react-router-dom";
import { checkUniqueUsername, checkUniqueEmail, checkPasswordsMatch, 
    checkRegPassword, attemptCreateAccount, clearError } from "./home_aux.jsx";
import "./home.css"

var fields_register = [null, null, null, null];
const emptyRegisterMsgs = ["Must enter email", "Must enter username", "Must enter password", "Must confirm password"];
var EmailsCache = Object();

export function Register() {
    var setInputEmail, setInputUsernameR, setInputPasswordR, setInputRepeatPassword;
    [fields_register[0], setInputEmail] = React.useState("");
    [fields_register[1], setInputUsernameR] = React.useState("");
    [fields_register[2], setInputPasswordR] = React.useState("");
    [fields_register[3], setInputRepeatPassword] = React.useState("");
    var RegisterErrorMsgRef = React.useRef(null);

    return (
        <div className="body home">
            <div className="page-info">
                <link rel="icon" href="delver.png" />
                <title>Sign up for Starsight account</title>
            </div>

            <header>
                <h1>Sign up for Starsight account</h1>
                <nav>
                    <NavLink className="navlink" to="/">Home</NavLink>
                    <NavLink className="navlink" to="/game">Game</NavLink>
                    <NavLink className="navlink" to="/scores">Scores</NavLink>
                </nav>
            </header>

            <main className="home">
                <div className="form">
                    <section>
                        <label htmlFor="email">E-mail:</label>
                        <input type="email" onBlur={(event) => { console.log(checkUniqueEmail(fields_register, emptyRegisterMsgs, RegisterErrorMsgRef)); }}
                            onChange={(event) => { clearError(RegisterErrorMsgRef); setInputEmail(event.target.value); }}></input>
                    </section>

                    <section>
                        <label htmlFor="username">Username:</label>
                        <input type="username" onBlur={(event) => { console.log("something!"); checkUniqueUsername(fields_register, emptyRegisterMsgs, RegisterErrorMsgRef); }}
                            onChange={(event) => {clearError(RegisterErrorMsgRef); setInputUsernameR(event.target.value); }}></input>
                    </section>

                    <section>
                        <label htmlFor="password">Password:</label>
                        <input type="password" onBlur={(event) => { checkRegPassword(fields_register, emptyRegisterMsgs, RegisterErrorMsgRef); }}
                        onChange={(event) => {clearError(RegisterErrorMsgRef); setInputPasswordR(event.target.value); }}></input>
                    </section>

                    <section>
                        <label htmlFor="password">Confirm Password:</label>
                        <input type="password" onBlur={(event) => { checkPasswordsMatch(fields_register, emptyRegisterMsgs, RegisterErrorMsgRef); }}
                        onChange={(event) => {clearError(RegisterErrorMsgRef); setInputRepeatPassword(event.target.value); }}></input>
                    </section>

                    <button onClick={() => {attemptCreateAccount(fields_register, emptyRegisterMsgs, RegisterErrorMsgRef);}}>Create account</button>
                    <div className="errorMsg" ref={RegisterErrorMsgRef}></div>
                </div>
            </main>

        </div>
    );
}

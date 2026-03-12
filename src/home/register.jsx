import React from "react";
import { NavLink } from "react-router-dom";
import { checkUniqueUsername, checkUniqueEmail, checkPasswordsMatch, attemptCreateAccount, checkNotEmpty } from "./misc.jsx";
import "./home.css"

var fields = [null, null, null, null];
const emptyMsgs = ["Must enter email", "Must enter username", "Must enter password", "Must confirm password"];

export function Register() {
    [fields[0], setInputEmail] = React.useState("");
    [fields[1], setInputUsernameR] = React.useState("");
    [fields[2], setInputPasswordR] = React.useState("");
    [fields[3], setInputRepeatPassword] = React.useState("");
    var errorMsgRef = React.useRef(null);

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
                        <input type="email" onBlur={(event) => { checkUniqueEmail(fields, emptyMsgs, errorMsgRef); }}
                            onChange={(event) => { setInputEmail(event.target.value); }}></input>
                    </section>

                    <section>
                        <label htmlFor="username">Username:</label>
                        <input type="username" onBlur={(event) => { checkUniqueUsername(fields, emptyMsgs, errorMsgRef); }}
                            onChange={(event) => { setInputUsernameR(event.target.value); }}></input>
                    </section>

                    <section>
                        <label htmlFor="password">Password:</label>
                        <input type="password" onBlur={(event) => { checkNotEmpty(event.target.value, errorMsgRef, "Must enter password"); }}
                        onChange={(event) => { setInputPasswordR(event.target.value); }}></input>
                    </section>

                    <section>
                        <label htmlFor="password">Confirm Password:</label>
                        <input type="password" onBlur={(event) => { checkPasswordsMatch(inputPasswordR, event.target.value, errorMsgRef); }}
                        onChange={(event) => { setInputRepeatPassword(event.target.value); }}></input>
                    </section>

                    <button onClick={() => {attemptCreateAccount(fields.email, inputUsernameR, inputPasswordR, inputRepeatPassword, errorMsgRef);}}>Create account</button>
                    <div className="errorMsg" ref={errorMsgRef}></div>
                </div>
            </main>

        </div>
    );
}

import React from "react";
import { checkUniqueUsername, checkPasswordsMatch, 
    checkRegPassword, attemptCreateAccount, clearError } from "./home_aux.jsx";
import "./home.css"
import { PageHeading } from "../misc.jsx";

var fields_register = [null, null, null];
const emptyRegisterMsgs = ["Must enter username", "Must enter password", "Must confirm password"];

export function Register() {
    var setInputUsernameR, setInputPasswordR, setInputRepeatPassword;
    [fields_register[0], setInputUsernameR] = React.useState("");
    [fields_register[1], setInputPasswordR] = React.useState("");
    [fields_register[2], setInputRepeatPassword] = React.useState("");
    var RegisterErrorMsgRef = React.useRef(null);

    return (
        <div className="body home">
            <PageHeading title="Create an Account"/>

            <main className="home">
                <div className="form">
                    <section>
                        <label htmlFor="username">Username:</label>
                        <input type="username" onBlur={(event) => { console.log("checking... " + checkUniqueUsername(fields_register, emptyRegisterMsgs, RegisterErrorMsgRef)); }}
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
            <footer>
                <p>View on</p>
                <p>
                    <a href="https://github.com/MattSteveMitch/startup">
                        <img src="github.png" alt="Github logo" width="40" />
                    </a>
                </p>
                <p id="author">Matthew Mitchell</p>
            </footer>
        </div>
    );
}

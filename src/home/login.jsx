import React from "react";
import { NavLink } from "react-router-dom";
import {checkValidUsername, checkLoginPassword, submitLoginInfo, clearError} from "./home_aux.jsx";
import "./home.css";

var fields_login = [null, null];
const emptyLoginMsgs = ["Must enter username", "Must enter password"];

export function Login() {
    localStorage.setItem("username", "Guest");
    var setInputPassword, setInputUsername;
    [fields_login[0], setInputUsername] = React.useState("");
    [fields_login[1], setInputPassword] = React.useState("");
    var LoginErrorMsgRef = React.useRef(null);

    return (
        <div className="body home">
            <div className="page-info">
                <link rel="icon" href="delver.png" />
                <title>Log into Starsight</title>
            </div>
            <header>
                <h1>Log into Starsight</h1>
                <nav>
                    <NavLink className="current navlink" to="/">Home</NavLink>
                    <NavLink className="navlink" to="/game">Game</NavLink>
                    <NavLink className="navlink" to="/scores">Scores</NavLink>
                </nav>
            </header>
            <main className="home">
                <div className="form">
                    <section>
                        <label htmlFor="username">Username:</label>
                        <input type="username" onBlur={(event) => {checkValidUsername(fields_login, emptyLoginMsgs, LoginErrorMsgRef);}} 
                        onChange={(event) => {clearError(LoginErrorMsgRef); setInputUsername(event.target.value);}}>
                        </input>
                    </section>

                    <section>
                        <label htmlFor="password">Password:</label>
                        <input type="password" onBlur={(event) => {checkLoginPassword(fields_login, emptyLoginMsgs, LoginErrorMsgRef);}}
                        onChange={(event) => {clearError(LoginErrorMsgRef); setInputPassword(event.target.value);}} >
                        </input>
                    </section>

                    <button onClick={() => {submitLoginInfo(fields_login, emptyLoginMsgs, LoginErrorMsgRef);}}>Log in</button>
                    <button onClick={() => {document.location.href = "/register";}}>Create account</button>
                    
                    <div className="errorMsg" ref={LoginErrorMsgRef}></div>
                </div>
            </main>

            <footer>
                <p>View on</p>
                <a href="https://github.com/MattSteveMitch/startup">
                    <img src="github.png" alt="Github logo" width="70" />
                </a>
                <p id="author">Matthew Mitchell</p>
            </footer>
        </div>
    );
}

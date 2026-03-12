import React from "react";
import { NavLink } from "react-router-dom";
import {checkValidUsername} from "./misc.jsx";
import "./home.css";

localStorage.setItem("username", "Josh");

export function Login() {
    var [inputPassword, setInputPassword] = React.useState("");
    var [inputUsername, setInputUsername] = React.useState("");
    var errorMsgRef = React.useRef(null);

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
                        <input type="username" onBlur={(event) => {checkValidUsername(event.target.value, errorMsgRef);}} onChange={(event) => {setInputUsername(event.target.value);}}>
                        </input>
                    </section>

                    <section>
                        <label htmlFor="password">Password:</label>
                        <input type="password" onChange={(event) => {setInputPassword(event.target.value);}} >
                        </input>
                    </section>

                    <button onClick={() => {submitLoginInfo(inputUsername, inputPassword);}}>Log in</button>
                    <a href="/register">
                        <button>Create account</button>
                    </a>
                    <div className="errorMsg" ref={errorMsgRef}></div>
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

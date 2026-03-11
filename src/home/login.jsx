import React from "react";
import {NavLink} from "react-router-dom";
import "./home.css";

localStorage.setItem("username", "Josh");

export function Login() {
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
                <div>
                    <form action="/game">
                        <section>
                            <label htmlFor="username">Username:</label>
                            <input type="username">
                            </input>
                        </section>

                        <section>
                            <label htmlFor="password">Password:</label>
                            <input type="password">
                            </input>
                        </section>

                        <button type="submit">Log in</button>
                        <a href="/register">
                            <button type="button">Create account</button>
                        </a>
                    </form>
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

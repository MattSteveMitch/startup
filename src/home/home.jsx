import React from "react";
import {NavLink} from "react-router-dom";

export function Home() {
    return (
        <div className="body">
            <header>
                <h1>Log into Starsight</h1>
                <nav>
                    <NavLink className="current navlink" to="/">Home</NavLink>
                    <NavLink className="navlink" to="/game">Game</NavLink>
                    <NavLink className="navlink" to="/scores">Scores</NavLink>
                </nav>
            </header>
            <main>
                <div>
                    <form action="game.html">
                        <section>
                            <label for="username">Username:</label>
                            <input type="username">
                            </input>
                        </section>

                        <section>
                            <label for="password">Password:</label>
                            <input type="password">
                            </input>
                        </section>

                        <button type="submit">Log in</button>
                        <a href="register.html">
                            <button type="button">Create account</button>
                        </a>
                    </form>
                </div>
            </main>

            <footer>
                <p>View on</p>
                <a href="https://github.com/MattSteveMitch/startup">
                    <img src="images/github.png" alt="Github logo" width="70" />
                </a>
                <p>Matthew Mitchell</p>
            </footer>
        </div>
    )
}

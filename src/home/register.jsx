import React from "react";
import {NavLink} from "react-router-dom";
import "./home.css"

export function Register() {
    return (
        <div className="body">
            <header>
                <h1>Sign up for Starsight account</h1>
                <nav>
                    <NavLink className="navlink" to="/">Home</NavLink>
                    <NavLink className="navlink" to="/game">Game</NavLink>
                    <NavLink className="navlink" to="/scores">Scores</NavLink>
                </nav>
            </header>

            <main>
                <div>
                    <form action="/">
                        <section>
                            <label for="email">E-mail:</label>
                            <input type="email">
                            </input>
                        </section>

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

                        <section>
                            <label for="password">Confirm Password:</label>
                            <input type="password">
                            </input>
                        </section>

                        <button type="submit">Create account</button>

                    </form>
                </div>
            </main>

        </div>
    );
}

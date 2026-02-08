import React from "react";
import {NavLink} from "react-router-dom";

export function Game() {
    return (
        <div className="body">
            <header>
                <h1>Play Starsight</h1>
                <nav>
                    <NavLink className="navlink" to="/">Home</NavLink>
                    <NavLink className="current navlink" to="/game">Game</NavLink>
                    <NavLink className="navlink" to="/scores">Scores</NavLink>
                </nav>
            </header>

            <main>
                <section className="sidebar">
                    <h2 className="head">Scores summary</h2>
                    <h2 className="subhead">(lower scores are better)</h2>
                    <div>
                        <section>
                            <h3>Most recent score:</h3>
                            <div className="score-display" name="current">
                                <p className="score">22</p>
                                <p className="score-side-text">New personal best!</p>
                            </div>
                            <div className="share">Share:
                                <a href="https://facebook.com/">
                                    <img src="images/fb_logo.png" alt="Facebook logo" width="23" />
                                </a>
                                <a href="https://x.com/">
                                    <img src="images/x_logo.png" alt="X Twitter logo" width="20" />
                                </a>
                            </div>
                        </section>
                        <section className="best-score">
                            <h3>Personal best score:</h3>
                            <p className="score" name="PR">22</p>
                        </section>
                        <section className="best-score">
                            <h3>Overall best score:</h3>
                            <div className="score-display">
                                <p className="score">12</p>
                                <p className="score-side-text">Set by Grond2</p>
                            </div>
                        </section>
                    </div>

                    <div className="best-hits">
                        <section>
                            <h3>Personal best hit:</h3>
                            <p className="hit">118</p>
                        </section>
                        <section>
                            <h3>Overall best hit:</h3>
                            <div className="score-display">
                                <p className="hit">158</p>
                                <p className="hit-side-text">Set by Nolendil</p>
                            </div>
                        </section>
                    </div>
                </section>

                <section className="window">
                    <img src="images/game_window_placeholder.png" alt="Game window" width="880" />
                </section>

            </main>
        </div>
    );
}
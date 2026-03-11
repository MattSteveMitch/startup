import React from "react";
import { NavLink } from "react-router-dom";
import { getScores } from "../misc.jsx";
import "./scores.css";

export function Scores() {
    let pers_bests = getScores(localStorage.getItem("username") + "_best_scores");
    let bests = getScores("best_scores");
    let bests_table = [];
    for (let i = 0; i < bests.length; i++) {
        bests_table.push(
            <tr>
                <td>{i + 1}</td>
                <td>{bests[i].username}</td>
                <td>{bests[i].score}</td>
            </tr>
        );
    }

    let pers_bests_table = [];
    for (let i = 0; i < pers_bests.length; i++) {
        pers_bests_table.push(
            <tr>
                <td>{i + 1}</td>
                <td>{pers_bests[i].score}</td>
            </tr>
        );
    }

    return (
        <div className="body">
            <div className="page-info">
                <link rel="icon" href="delver.png" />
                <title>Best Scores</title>
            </div>

            <header>
                <h1>Best Scores</h1>
                <nav>
                    <NavLink className="navlink" to="/">Home</NavLink>
                    <NavLink className="navlink" to="/game">Game</NavLink>
                    <NavLink className="current navlink" to="/scores">Scores</NavLink>
                </nav>
            </header>

            <main>
                <section className="score">
                    <h2 className="score-page">Least deaths to complete the game</h2>
                    <h3 className="score-page">Overall best</h3>
                    <table>
                        <th className="rank">Rank</th>
                        <th className="player">Player</th>
                        <th>Score</th>
                        <tbody>
                            <tr className="spare">
                                <td></td>
                                <td></td>
                                <td>(number of deaths)</td>
                            </tr>
                            {bests_table}
                        </tbody>
                    </table>

                    <div className="personal">
                        <h3 className="score-page">Personal best</h3>
                        <table>
                            <th></th>
                            <th>Score</th>
                            <tbody>
                                <tr className="spare">
                                    <td></td>
                                    <td>(number of deaths)</td>
                                </tr>
                                {pers_bests_table}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className="hits">
                    <h2 className="score-page">Most damaging hits to Krell ship</h2>
                    <h3 className="score-page">Overall best</h3>
                    <table>
                        <th className="rank">Rank</th>
                        <th className="player">Player</th>
                        <th>Damage dealt</th>
                        <tbody>
                            <tr className="spare">
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>1</td>
                                <td>ElegyMan</td>
                                <td>179.2</td>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td>ElegyMan</td>
                                <td>161.6</td>
                            </tr>
                            <tr>
                                <td>3</td>
                                <td>AnonymousCl</td>
                                <td>121.0</td>
                            </tr>
                            <tr>
                                <td>4</td>
                                <td>Bro</td>
                                <td>110.1</td>
                            </tr>
                            <tr>
                                <td>5</td>
                                <td>Grond2</td>
                                <td>100.1</td>
                            </tr>
                            <tr>
                                <td>6</td>
                                <td>Grond</td>
                                <td>79.4</td>
                            </tr>
                            <tr>
                                <td>7</td>
                                <td>Based4892</td>
                                <td>79.3</td>
                            </tr>
                            <tr>
                                <td>8</td>
                                <td>Nolendil</td>
                                <td>75.0</td>
                            </tr>
                            <tr>
                                <td>9</td>
                                <td>Swordsman12</td>
                                <td>70.1</td>
                            </tr>
                            <tr>
                                <td>10</td>
                                <td>Nolendil</td>
                                <td>68.1</td>
                            </tr>
                        </tbody>
                    </table>

                    <div className="personal">
                        <h3 className="score-page">Personal best</h3>
                        <table>
                            <th></th>
                            <th>Damage dealt</th>
                            <tbody>
                                <tr className="spare">
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>1</td>
                                    <td>179.2</td>
                                </tr>
                                <tr>
                                    <td>2</td>
                                    <td>161.6</td>
                                </tr>
                                <tr>
                                    <td>3</td>
                                    <td>121.0</td>
                                </tr>
                                <tr>
                                    <td>4</td>
                                    <td>110.1</td>
                                </tr>
                                <tr>
                                    <td>5</td>
                                    <td>100.1</td>
                                </tr>
                                <tr>
                                    <td>6</td>
                                    <td>79.4</td>
                                </tr>
                                <tr>
                                    <td>7</td>
                                    <td>79.3</td>
                                </tr>
                                <tr>
                                    <td>8</td>
                                    <td>75.0</td>
                                </tr>
                                <tr>
                                    <td>9</td>
                                    <td>70.1</td>
                                </tr>
                                <tr>
                                    <td>10</td>
                                    <td>68.1</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

            </main>
        </div>
    );
}
import React from "react";
import { NavLink } from "react-router-dom";
import { getScores, Logout_or_Home } from "../misc.jsx";
import "./scores.css";

export function Scores() {
    let best_scores = getScores("best_scores");
    let best_scores_table = [];
    for (let i = 0; i < best_scores.length; i++) {
        best_scores_table.push(
            <tr key={i}>
                <td className="rank">{i + 1}</td>
                <td className="player">{best_scores[i].username}</td>
                <td className="number">{best_scores[i].score}</td>
            </tr>
        );
    }

    let pers_best_scores = getScores(localStorage.getItem("username") + "_best_scores");
    let pers_best_scores_table = [];
    for (let i = 0; i < pers_best_scores.length; i++) {
        pers_best_scores_table.push(
            <tr key={i}>
                <td className="rank">{i + 1}</td>
                <td className="number">{pers_best_scores[i].score}</td>
            </tr>
        );
    }

    let best_hits = getScores("best_hits");
    let best_hits_table = [];
    for (let i = 0; i < best_hits.length; i++) {
        best_hits_table.push(
            <tr key={i}>
                <td className="rank">{i + 1}</td>
                <td className="player">{best_hits[i].username}</td>
                <td className="number">{best_hits[i].score}</td>
            </tr>
        );
    }

    let pers_best_hits = getScores(localStorage.getItem("username") + "_best_hits");
    let pers_best_hits_table = [];
    for (let i = 0; i < pers_best_hits.length; i++) {
        pers_best_hits_table.push(
            <tr key={i}>
                <td className="rank">{i + 1}</td>
                <td className="number">{pers_best_hits[i].score}</td>
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
                    <NavLink className="navlink" to="/"><Logout_or_Home /></NavLink>
                    <NavLink className="navlink" to="/game">Game</NavLink>
                    <NavLink className="current navlink" to="/scores">Scores</NavLink>
                </nav>
            </header>

            <main>
                <section className="score">
                    <h2 className="score-page">Least deaths to complete the game</h2>
                    <h3 className="score-page">Overall best</h3>
                    <table>
                        <tr>
                            <th className="rank-header">Rank</th>
                            <th className="player-header">Player</th>
                            <th>Score</th>
                        </tr>
                        <tr className="spare">
                            <td className="rank-header"></td>
                            <td className="player-header"></td>
                            <td>(number of deaths)</td>
                        </tr>
                        <tbody>
                            {best_scores_table}
                        </tbody>
                    </table>

                    <div className="personal">
                        <h3 className="score-page">Personal best</h3>
                        <table>
                            <tr>
                                <th className="rank-header"></th>
                                <th>Score</th>
                            </tr>
                            <tr className="spare">
                                <td className="rank-header"></td>
                                <td>(number of deaths)</td>
                            </tr>
                            <tbody>
                                {pers_best_scores_table}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className="hits">
                    <h2 className="score-page">Most damaging hits to Krell ship</h2>
                    <h3 className="score-page">Overall best</h3>
                    <table>
                        <tr>
                            <th className="rank-header">Rank</th>
                            <th className="player-header">Player</th>
                            <th>Damage dealt</th>
                        </tr>
                        <tr className="spare">
                            <td className="rank-header"></td>
                            <td className="player-header"></td>
                            <td></td>
                        </tr>
                        <tbody>
                            {best_hits_table}
                        </tbody>
                    </table>

                    <div className="personal">
                        <h3 className="score-page">Personal best</h3>
                        <table>
                            <tr>
                                <th className="rank-header"></th>
                                <th>Damage dealt</th>
                            </tr>
                            <tr className="spare">
                                <td className="rank-header"></td>
                                <td></td>
                            </tr>
                            <tbody>
                                {pers_best_hits_table}
                            </tbody>
                        </table>
                    </div>
                </section>

            </main>
        </div>
    );
}
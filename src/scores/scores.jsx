import React from "react";
import { getScores, Navbar } from "../misc.jsx";
import "./scores.css";

export function Scores() {
    //var best_scores, pers_best_scores, best_hits, pers_best_hits;
    var [best_scores, set_best_scores] = React.useState([]);
    var [pers_best_scores, set_pers_best_scores] = React.useState([]);
    var [best_hits, set_best_hits] = React.useState([]);
    var [pers_best_hits, set_pers_best_hits] = React.useState([]);

    const scoreErrorMsgRef = React.useRef(null);

    React.useEffect(() => {
        fetch("/api/scores",
            { method: "get", headers: { "Content-type": "application/json; charset=UTF-8" } }
        ).then((response) => {
            if (response.status === 200) {
                response.json().then((body) => {
                    set_best_scores(body.overall_bests ?? []);
                    set_pers_best_scores(body.pers_bests ?? []);
                    set_best_hits(body.overall_best_hits ?? []);
                    set_pers_best_hits(body.pers_best_hits ?? []);
                });
            }
            else if (response.status === 401) {
                scoreErrorMsgRef.current.innerHTML = "Error: Please log back in";
            }
            else {
                scoreErrorMsgRef.current.innerHTML = response.status + ": " + response.statusText;
            }
        }).catch((error) => {
            scoreErrorMsgRef.current.innerHTML = "Server unavailable";
        });
    }, []);

    let best_scores_table = [];
    let name = null;
    for (let i = 0; i < best_scores.length; i++) {
        let prevName = name;
        name = (i !== 0) ?
            ((best_scores[i].score === best_scores[i - 1].score) ? prevName : (i + 1)) : 1;

        best_scores_table.push(
            <tr name={name} key={i}>
                <td className="rank">{i + 1}</td>
                <td className="player">{best_scores[i].username}</td>
                <td className="number">{best_scores[i].score}</td>
            </tr>
        );
    }

    let pers_best_scores_table = [];
    for (let i = 0; i < pers_best_scores.length; i++) {
        pers_best_scores_table.push(
            <tr key={i}>
                <td className="rank">{i + 1}</td>
                <td className="number">{pers_best_scores[i].score}</td>
            </tr>
        );
    }

    let best_hits_table = [];
    for (let i = 0; i < best_hits.length; i++) {
        let prevName = name;
        name = (i !== 0) ? 
            ((best_hits[i].score === best_hits[i - 1].score) ? prevName : (i + 1)) : 1;
        // This makes color coding of the top 3 account for ties
        
        best_hits_table.push(
            <tr name={name} key={i}>
                <td className="rank">{i + 1}</td>
                <td className="player">{best_hits[i].username}</td>
                <td className="number">{best_hits[i].score}</td>
            </tr>
        );
    }

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
                <Navbar />
            </header>

            <main className="scores">
                <div className="all-scores">
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
                </div>
                <div className="errorMsg score-page bad" ref={scoreErrorMsgRef}></div>

            </main>
        </div>
    );
}
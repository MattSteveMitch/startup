import React from "react";
import { NavLink } from "react-router-dom";
import "./scores.css";

export function Scores() {
    return (
        <div className="body">
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
                    <h2>Least deaths to complete the game</h2>
                    <h3>Overall best</h3>
                    <table>
                        <th className="rank">Rank</th>
                        <th className="player">Player</th>
                        <th>Score</th>
                        <tr className="spare">
                            <td></td>
                            <td></td>
                            <td>(number of deaths)</td>
                        </tr>
                        <tr>
                            <td>1</td>
                            <td>AnonymousCloud6312</td>
                            <td>12</td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>ElegyMan</td>
                            <td>13</td>
                        </tr>
                        <tr>
                            <td>3</td>
                            <td>AnonymousCloud6312</td>
                            <td>21</td>
                        </tr>
                        <tr>
                            <td>4</td>
                            <td>Bro</td>
                            <td>22</td>
                        </tr>
                        <tr>
                            <td>5</td>
                            <td>Grond2</td>
                            <td>22</td>
                        </tr>
                        <tr>
                            <td>6</td>
                            <td>Grond</td>
                            <td>22</td>
                        </tr>
                        <tr>
                            <td>7</td>
                            <td>Based4892</td>
                            <td>26</td>
                        </tr>
                        <tr>
                            <td>8</td>
                            <td>Nolendil</td>
                            <td>30</td>
                        </tr>
                        <tr>
                            <td>9</td>
                            <td>Swordsman12</td>
                            <td>35</td>
                        </tr>
                        <tr>
                            <td>10</td>
                            <td>Nolendil</td>
                            <td>41</td>
                        </tr>
                    </table>

                    <div className="personal">
                        <h3>Personal best</h3>
                        <table>
                            <th></th>
                            <th>Score</th>
                            <tr className="spare">
                                <td></td>
                                <td>(number of deaths)</td>
                            </tr>
                            <tr>
                                <td>1</td>
                                <td>12</td>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td>13</td>
                            </tr>
                            <tr>
                                <td>3</td>
                                <td>21</td>
                            </tr>
                            <tr>
                                <td>4</td>
                                <td>22</td>
                            </tr>
                            <tr>
                                <td>5</td>
                                <td>22</td>
                            </tr>
                            <tr>
                                <td>6</td>
                                <td>22</td>
                            </tr>
                            <tr>
                                <td>7</td>
                                <td>26</td>
                            </tr>
                            <tr>
                                <td>8</td>
                                <td>30</td>
                            </tr>
                            <tr>
                                <td>9</td>
                                <td>35</td>
                            </tr>
                            <tr>
                                <td>10</td>
                                <td>41</td>
                            </tr>
                        </table>
                    </div>
                </section>

                <section>
                    <h2>Most damaging hits to Krell ship</h2>
                    <h3>Overall best</h3>
                    <table>
                        <th className="rank">Rank</th>
                        <th className="player">Player</th>
                        <th>Damage dealt</th>
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
                    </table>

                    <div className="personal">
                        <h3>Personal best</h3>
                        <table>
                            <th></th>
                            <th>Damage dealt</th>
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
                        </table>
                    </div>
                </section>

            </main>
        </div>
    );
}
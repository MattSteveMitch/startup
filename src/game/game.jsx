import React from "react";
import {NavLink} from "react-router-dom";
import {keyPress} from "./playerInputHandler.jsx";
import {runGame} from "./runGame.jsx";
import {loadImages} from "./loadImages.jsx";
import "./game.css";

const names = ["thumbnail", "play-button"];

export function Game() {
    const windowRef = React.useRef(null);
    var window;
    var y = 0;
    var imageMap = Object();

    React.useEffect(() => {
        const handler = (event) => {y += 20; keyPress(event, window, y);};
        window = windowRef.current.getContext("2d");
        document.addEventListener("keydown", handler);
        var imagesProm = loadImages(names);
        imagesProm.then((images) => {
            for (let i = 0; i < names.length; i++) {
                imageMap[names[i]] = images[i];
            }
            console.log(imageMap.thumbnail.complete);
            window.drawImage(imageMap.thumbnail, 0, 0, 880, 560);
        });

        return (() => {document.removeEventListener("keydown", handler);});
    });

    
    return (
        <div className="body">
            <div className="page-info">
                <link rel="icon" href="delver.png" />
                <title>Play Starsight</title>
            </div>
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
                            <h3 className="game-page">Most recent score:</h3>
                            <div className="score-display" name="current">
                                <p className="score">22</p>
                                <p className="score-side-text">New personal best!</p>
                            </div>
                            <div className="share" onClick={runGame}>Share:
                                <a href="https://facebook.com/">
                                    <img src="fb_logo.png" alt="Facebook logo" width="23" />
                                </a>
                                <a href="https://x.com/">
                                    <img src="x_logo.png" alt="X Twitter logo" width="20" />
                                </a>
                            </div>
                        </section>
                        <section className="best-score">
                            <h3 className="game-page">Personal best score:</h3>
                            <p className="score" name="PR">22</p>
                        </section>
                        <section className="best-score">
                            <h3 className="game-page">Overall best score:</h3>
                            <div className="score-display">
                                <p className="score">12</p>
                                <p className="score-side-text">Set by Grond2</p>
                            </div>
                        </section>
                    </div>

                    <div className="best-hits">
                        <section>
                            <h3 className="game-page">Personal best hit:</h3>
                            <p className="hit">118</p>
                        </section>
                        <section>
                            <h3 className="game-page">Overall best hit:</h3>
                            <div className="score-display">
                                <p className="hit">158</p>
                                <p className="hit-side-text">Set by Nolendil</p>
                            </div>
                        </section>
                    </div>
                </section>

                <section className="window">
                    <canvas ref={windowRef} alt="Game window" onClick={runGame} width={880} height={560} id="game-screen" />
                </section>

            </main>
        </div>
    );
}
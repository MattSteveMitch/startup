import React from "react";
import {NavLink} from "react-router-dom";
import {keyPress} from "./playerInputHandler.jsx";
import {runGame} from "./runGame.jsx";
import {loadImages, loadThumbnail, updateGraphics} from "./animation.jsx";
import "./game.css";

const img_names = ["arrow", "background1", "bubble", "bubble2", "explosion", "flame", "logo", "m-bot", "poco", "rock", "text"];
const graphicsMap = Object();
graphicsMap.windowHeight = 560;
graphicsMap.windowWidth = 880;
graphicsMap.buttonSize = graphicsMap.windowHeight / 4;

export function Game() {
    const windowRef = React.useRef(null);
    var gameWindow;
    var y = 0;
    localStorage.setItem("loaded", "");

    React.useEffect(() => {
        localStorage.setItem("started", "");

        const handler = (event) => {y += 20; keyPress(event, gameWindow, y, graphicsMap);};

        gameWindow = windowRef.current.getContext("2d");
        var imgs_loaded = loadThumbnail();
        imgs_loaded.then((thumbnail_imgs) => {
            graphicsMap.thumbnail = thumbnail_imgs[0];
            graphicsMap.play_button = thumbnail_imgs[1];
            requestAnimationFrame((lastFrameTime) => {updateGraphics(lastFrameTime, graphicsMap, gameWindow);});
        });

        document.addEventListener("keydown", handler);
        var imagesProm = loadImages(img_names);
        imagesProm.then((images) => {
            for (let i = 0; i < img_names.length; i++) {
                graphicsMap[img_names[i]] = images[i];
            }
            localStorage.setItem("loaded", "t");
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
                            <div className="share">Share:
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
                    <canvas ref={windowRef} alt="Game window"
                        width={graphicsMap.windowWidth} height={graphicsMap.windowHeight}
                        onClick={() => {runGame();} } />
                </section>

            </main>
        </div>
    );
}
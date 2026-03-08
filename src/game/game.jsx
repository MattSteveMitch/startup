import React from "react";
import { NavLink } from "react-router-dom";
import { handleKeyPress, handleKeyRelease, handleMouseMove, handleScroll } from "./playerInputHandler.jsx";
import { loadImages, loadThumbnail, updateGraphics, windowSize } from "./animation.jsx";
import { runGame } from "./runGame.jsx";
import "./game.css";

const img_names = ["arrow", "background1", "background2", "background3", "bubble", "bubble2", "explosion", "flame", "krell", "logo", "m-bot", "poco", "rock", "sound_off", "sound_on", "text"];

const graphicsMap = Object();
const eventsMap = Object();

var started, respawning, shooting, brake, gameWindow;
// brake, start, respawn, alive, stopshoot, LLactive, LLangle, framessincearrow, gamepause, restart, sound, framessincesound
graphicsMap.buttonSize = windowSize[1] / 4;

export function Game() {
    [eventsMap.mousePos, eventsMap.setMouse] = React.useState([0, 0]);
    [brake, eventsMap.toggleBrake] = React.useState(false);
    [started, eventsMap.setStart] = React.useState(false);
    eventsMap.alive = React.useState(true);
    [respawning, eventsMap.setRespawning] = React.useState(false);
    [shooting, eventsMap.toggleShooting] = React.useState(false);
    [eventsMap.loaded, eventsMap.setLoaded] = React.useState(false);
    [eventsMap.started, eventsMap.setStarted] = React.useState(false);
    [eventsMap.LLAngle, eventsMap.setLLAngle] = React.useState(false);
    const graphicsMapRef = React.useRef(graphicsMap);
    const windowRef = React.useRef(null);

    React.useEffect(() => {
        const handler = (event) => { handleKeyPress(event, eventsMap); };
        gameWindow = windowRef.current.getContext("2d");
        gameWindow.save();
        var thumbnail_loaded = loadThumbnail();
        thumbnail_loaded.then((thumbnail_imgs) => {
            graphicsMap.thumbnail = thumbnail_imgs[0];
            graphicsMap.play_button = thumbnail_imgs[1];
            requestAnimationFrame((lastFrameTime) => {
                updateGraphics(graphicsMap, gameWindow, eventsMap);
            });
        });

        document.addEventListener("keydown", handler);

        return (() => { document.removeEventListener("keydown", handler); });
    }, []);


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
                    <canvas ref={windowRef} alt="Game window" className="unclicked"
                        width={windowSize[0]} height={windowSize[1]}
                        onClick={() => {
                            if (!eventsMap.started) {
                                runGame(windowRef, eventsMap.setStarted);
                            }
                            loadImages(graphicsMapRef, img_names, eventsMap.setLoaded);
                        }}
                        onMouseMove={(event) => { handleMouseMove(event, eventsMap); }} 
                        onWheel={(event) => {handleScroll(event, eventsMap);}}/>
                </section>
            </main>
        </div>
    );
}

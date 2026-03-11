import React from "react";
import { NavLink } from "react-router-dom";
import { handleKeyPress, handleKeyRelease, handleMouseMove, handleScroll, handleClick } from "./playerInputHandler.jsx";
import { loadAssets, loadThumbnail, updateGraphicsP0, windowSize } from "./animation.jsx";
import { runGame } from "./runGame.jsx";
import { addScore } from "../misc.jsx";
import "./game.css";

const img_names = ["arrow", "background1", "background2", "background3", "bubble", "bubble2", "explosion_img", 
    "flame", "intro_screen", "krell", "logo", "m-bot", "poco", "rock", "sound_off", "sound_on", "text"];

const sound_names = ["e", "explosion_aud", "intro", "krellshot", "laser", "LLAttached", "LLFire", "rockbreak", 
    "rush e", "silence", "wilhelm"];


const assetsMap = Object();
const environment = Object();

var respawning, click, gameWindow;
// brake, start, respawn, alive, stopshoot, LLactive, LLangle, framessincearrow, gamepause, restart, sound, framessincesound
assetsMap.buttonSize = windowSize[1] / 4;
const LLFire = new Audio("assets/LLFire.mp3");


localStorage.setItem("best_scores", []);
localStorage.setItem("personal_best_scores", []);
localStorage.setItem("best_hits", []);
localStorage.setItem("personal_best_hits", []);

export function Game() {
    [environment.mousePos, environment.setMouse] = React.useState([0, 0]);
    [environment.shipChoice, environment.setShip] = React.useState("");
    [environment.gamePage, environment.setGamePage] = React.useState(0);
    [environment.logoStartTime, environment.setLogoStart] = React.useState(0);
    [environment.brake, environment.toggleBrake] = React.useState(false);
    [environment.advance, environment.setAdv] = React.useState(false);
    [environment.goBack, environment.setGoBack] = React.useState(false);
    [environment.score, environment.setScore] = React.useState(100000);
    [environment.newScore, environment.setNewScore] = React.useState(null);
    [click, environment.setClick] = React.useState(false);
    [environment.rightClick, environment.setRClick] = React.useState(false);
    environment.alive = React.useState(true);
    [respawning, environment.setRespawning] = React.useState(false);
    [environment.shooting, environment.toggleShooting] = React.useState(false);
    [environment.loaded, environment.setLoaded] = React.useState(false);
    [environment.started, environment.setStarted] = React.useState(false);
    [environment.LLAngle, environment.setLLAngle] = React.useState(0);
    const assetsMapRef = React.useRef(assetsMap);
    const windowRef = React.useRef(null);

    React.useEffect(() => {
        const keyDownHandler = (event) => {
            handleKeyPress(event, environment, assetsMap); 
        };

        const keyUpHandler = (event) => {
            event.preventDefault();
            handleKeyRelease(event, environment);
        };

        const scrollHandler = (event) => {
            event.preventDefault();
            handleScroll(event, environment);
        };

        const rightClickHandler = (event) => {
            event.preventDefault();
            if (environment.rightClick) {
                assetsMap.LLAttached.play();
            }
            else {
                assetsMap.LLFire.play();
            }
            environment.setRClick(!environment.rightClick);
        };

        gameWindow = windowRef.current.getContext("2d");
        var thumbnail_loaded = loadThumbnail();
        thumbnail_loaded.then((thumbnail_imgs) => {
            assetsMap.thumbnail = thumbnail_imgs[0];
            assetsMap.play_button = thumbnail_imgs[1];
            requestAnimationFrame((lastFrameTime) => {
                environment.logoStartTime = lastFrameTime;
                updateGraphicsP0(assetsMap, gameWindow, environment);
            });
        });
        
        const windowEventTarget = document.getElementById("gameWindow");
        windowEventTarget.addEventListener("wheel", scrollHandler, {passive: false});
        windowEventTarget.addEventListener("contextmenu", rightClickHandler, {passive: false});
        //gameWindow.addEventListener("wheel", scrollHandler, {passive: false});
        document.addEventListener("keydown", keyDownHandler, {passive: false});
        document.addEventListener("keyup", keyUpHandler, {passive: false});


        return (() => { 
            document.removeEventListener("keydown", keyDownHandler);
            document.addEventListener("keyup", keyUpHandler);
            windowEventTarget.removeEventListener("wheel", scrollHandler, {passive: false});
        });
    }, []);

    React.useEffect(() => {
        if (environment.newScore != null) {
            addScore("personal_best_scores", environment.newScore);
            addScore("best_scores", environment.newScore);
            console.log("New Score: " + environment.newScore);
        }
    }, [environment.newScore]);


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
                        width={windowSize[0]} height={windowSize[1]} id="gameWindow"
                        onClick={(event) => {
                            if (!environment.started) {
                                runGame(windowRef, environment.setStarted);
                                loadAssets(assetsMapRef, img_names, sound_names, environment.setLoaded);
                            }
                            else {
                                handleClick(event, environment);
                            }
                        }}
                        onMouseMove={(event) => { handleMouseMove(event, environment); }} 
                        /*onWheel={(event) => {event.preventDefault(); handleScroll(event, eventsMap);}}*/ />
                </section>
            </main>
        </div>
    );
}

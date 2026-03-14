import React from "react";
import { NavLink } from "react-router-dom";
import { handleKeyPress, handleKeyRelease, handleMouseMove, handleScroll, handleClick } from "./playerInputHandler.jsx";
import { loadAssets, loadThumbnail, updateGraphicsP0, windowSize } from "./animation.jsx";
import { runGame } from "./runGame.jsx";
import { addScore, Logout_or_Home, nullish } from "../misc.jsx";
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

export function Game() {
    [environment.mousePos, environment.setMouse] = React.useState([0, 0]);
    [environment.shipChoice, environment.setShip] = React.useState("");
    [environment.gamePage, environment.setGamePage] = React.useState(0);
    [environment.brake, environment.toggleBrake] = React.useState(false);
    [environment.advance, environment.setAdv] = React.useState(false);
    [environment.goBack, environment.setGoBack] = React.useState(false);
    [environment.score, environment.setScore] = React.useState(100000);
    [environment.newScore, environment.setNewScore] = React.useState(null);
    [environment.newHit, environment.setNewHit] = React.useState(null);
    [environment.slashPresses, environment.setSlashPresses] = React.useState(0);
    [click, environment.setClick] = React.useState(false);
    [environment.rightClick, environment.setRClick] = React.useState(false);
    environment.alive = React.useState(true);
    [respawning, environment.setRespawning] = React.useState(false);
    [environment.shooting, environment.toggleShooting] = React.useState(false);
    [environment.loaded, environment.setLoaded] = React.useState(false);
    [environment.started, environment.setStarted] = React.useState(false);
    [environment.LLAngle, environment.setLLAngle] = React.useState(0);
    var windowRef = React.useRef(null);
    environment.latestScoreSideRef = React.useRef(null);
    environment.personalBestScoreRef = React.useRef(null);
    environment.overallBestScoreRef = React.useRef(null);
    environment.bestScoreSetterRef = React.useRef(null);
    environment.currentScoreRef = React.useRef(null);
    environment.shareButtonRef = React.useRef(null);
    environment.keepAnimating = React.useRef(true);

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
          //  console.log("starting animation");
            requestAnimationFrame((lastFrameTime) => {
                updateGraphicsP0(assetsMap, gameWindow, environment);
            });
        });

        const windowEventTarget = document.getElementById("gameWindow");
        windowEventTarget.addEventListener("wheel", scrollHandler, {passive: false});
        windowEventTarget.addEventListener("contextmenu", rightClickHandler, {passive: false});
        //gameWindow.addEventListener("wheel", scrollHandler, {passive: false});
        document.addEventListener("keydown", keyDownHandler, {passive: false});
        document.addEventListener("keyup", keyUpHandler, {passive: false});
      //  document.addEventListener("onunload", stopAnimation);


        return (() => { 
            document.removeEventListener("keydown", keyDownHandler);
            document.removeEventListener("keyup", keyUpHandler);

            environment.keepAnimating.current = false; /* You may ask why I don't just call `cancelAnimationFrame`,
            and I'll tell you why. Because you have to give it the index of the next frame that it's supposed 
            to cancel, and the animation loop is in the "animation.jsx" file, so I have to pass it a function
            to update the variable in this file keeping track of which frame is next up. But because of 
            asynchronousness and such, by the time it gets around to actually updating the frame-tracking 
            variable, that frame has already happened, so it's trying to cancel a frame that's passed already,
            so the animation continues. There's probably a better way, but I can't find it. That's my TED talk. */
            windowEventTarget.removeEventListener("wheel", scrollHandler, {passive: false});
        });
    }, []);

    React.useEffect(() => {
        //console.log("rerendering");
        let old_pers_best = addScore(localStorage.getItem("username") + "_best_scores", environment.newScore);
        if (nullish(environment.newScore)) {
            if (nullish(old_pers_best)) {
                environment.personalBestScoreRef.current.innerHTML = "";
            }
            else {
                environment.personalBestScoreRef.current.innerHTML = old_pers_best.score;
            }
        }
        else if (nullish(old_pers_best) || environment.newScore < old_pers_best.score) {
            environment.currentScoreRef.current.className = "number-area best";
            environment.personalBestScoreRef.current.className = "score number new";
            environment.personalBestScoreRef.current.innerHTML = environment.newScore;
            environment.shareButtonRef.current.className = "share new-best";
        }

        let old_best = addScore("best_scores", environment.newScore);
        if (nullish(environment.newScore)) {
            if (nullish(old_best)) {
                environment.overallBestScoreRef.current.innerHTML = "";
            }
            else {
                setBest(old_best.score, old_best.username);
            }
        }
        else if (nullish(old_best) || environment.newScore < old_best.score) {
            environment.overallBestScoreRef.current.className = "score number new";
            environment.bestScoreSetterRef.current.className = "score-side-text new-setter";
            setBest(environment.newScore, localStorage.getItem("username"));
        }
    }, [environment.newScore]);

    React.useEffect(() => {
        console.log("rerendering");
        if (environment.newHit != null) {
            addScore(localStorage.getItem("username") + "_best_hits", environment.newHit, true);
            addScore("best_hits", environment.newHit, true);
        }
    }, [environment.newHit]);


    return (
        <div className="body">
            <div className="page-info">
                <link rel="icon" href="delver.png" />
                <title>Play Starsight</title>
            </div>
            <header>
                <h1>Play Starsight</h1>
                <nav>
                    <NavLink className="navlink" to="/"><Logout_or_Home /></NavLink>
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
                            <div ref={environment.currentScoreRef} className="number-area" name="current-score">
                                <p className="score number">{environment.newScore}</p>
                                <p ref={environment.latestScoreSideRef} className="score-side-text">New personal best!</p>
                            </div>
                            <div ref={environment.shareButtonRef} className="share">Share:
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
                            <div className="number-area">
                                <p ref={environment.personalBestScoreRef} className="score number" name="pers-best"></p>
                            </div>
                        </section>
                        <section className="best-score">
                            <h3 className="game-page">Overall best score:</h3>
                            <div className="number-area">
                                <p ref={environment.overallBestScoreRef} className="score number" name="overall-best"></p>
                                <p ref={environment.bestScoreSetterRef} className="score-side-text"></p>
                            </div>
                        </section>
                    </div>

                    <div className="best-hits">
                        <section>
                            <h3 className="game-page">Personal best hit:</h3>
                            <div className="number-area">
                                <p className="hit number">118</p>
                            </div>
                        </section>
                        <section>
                            <h3 className="game-page">Overall best hit:</h3>
                            <div className="number-area">
                                <p className="hit number">158</p>
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
                                loadAssets(assetsMap, img_names, sound_names, environment.setLoaded);
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

function setBest(score, setter) {
    environment.overallBestScoreRef.current.innerHTML = score;
    environment.bestScoreSetterRef.current.innerHTML = "Set by " + setter;
}
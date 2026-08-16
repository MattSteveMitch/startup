import React from "react";
import { handleKeyPress, handleKeyRelease, handleMouseMove, handleScroll, handleClick } from "./playerInputHandler.jsx";
import { loadAssets, loadThumbnail, updateGraphicsP0, windowSize } from "./animation.jsx";
import { runGame } from "./runGame.jsx";
import { Navbar } from "../misc.jsx";
import { updateScores, updateHits, updateBests, setBestScore, setBestHit } from "./updateScores.jsx";
import "./game.css";

const img_names = ["arrow", "background1", "background2", "background3", "bubble", "bubble2", "controls", 
    "choose_ship", "explosion_img", "flame", "intro_screen", "krell", "logo", "m-bot", "poco", "rock", 
    "sound_off", "sound_on", "text"];

const assetsMap = Object();
const environment = Object();

var gameWindow;
assetsMap.buttonSize = windowSize[1] / 4;

export function Game() {
    [environment.newScore, environment.setNewScore] = React.useState(null);
    [environment.newHit, environment.setNewHit] = React.useState(null);
    var windowRef = React.useRef(null);
    environment.latestScoreSideRef = React.useRef(null);
    environment.personalBestScoreRef = React.useRef(null);
    environment.overallBestScoreRef = React.useRef(null);
    environment.bestScoreSetterRef = React.useRef(null);
    environment.currentScoreRef = React.useRef(null);
    environment.shareButtonRef = React.useRef(null);
    environment.keepAnimating = React.useRef(true);
    environment.personalBestHitRef = React.useRef(null);
    environment.overallBestHitRef = React.useRef(null);
    environment.bestHitSetterRef = React.useRef(null);
    environment.gameErrorMsgRef = React.useRef(null);
    environment.personalBestHitSideRef = React.useRef(null);

    React.useEffect(() => {
        environment.choosingShip = false;
        environment.shipChoice = "";
        environment.connected = false;
        environment.advance = false;
        environment.goBack = false;
        environment.won = false;
        environment.shooting = false;
        environment.brakeOn = false;
        environment.loaded = false;
        environment.started = false;
        environment.renderingStr = "";
        environment.soundStr = "";
        environment.restarting = false;

        const keyDownHandler = (event) => {
            event.preventDefault();
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
            if (environment.connected) {
                environment.websocket.send(")\n");
            }
        };

        gameWindow = windowRef.current.getContext("2d");
        loadThumbnail().then((thumbnail_imgs) => {
            assetsMap.thumbnail = thumbnail_imgs[0];
            assetsMap.play_button = thumbnail_imgs[1];
            requestAnimationFrame((lastFrameTime) => {
                gameWindow.save();
                updateGraphicsP0(assetsMap, gameWindow, environment);
            });
        });

        fetch("/api/bests", {
            method: "get",
            headers: { "Content-type": "application/json; charset=UTF-8" }
        }).then((response) => {updateBests(response, environment);})
        .catch((error) => {
            environment.gameErrorMsgRef.current.innerHTML = "Server unavailable";
        });

        const windowEventTarget = document.getElementById("gameWindow");
        windowEventTarget.addEventListener("wheel", scrollHandler, {passive: false});
        windowEventTarget.addEventListener("contextmenu", rightClickHandler, {passive: false});
        document.addEventListener("keydown", keyDownHandler, {passive: false});
        document.addEventListener("keyup", keyUpHandler, {passive: false});

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

            if (environment.websocket) {
                environment.websocket.close();
                environment.websocket = null;
            }
            assetsMap.sfx.unload();
            assetsMap.music.unload();
        });
    }, []);

//    React.useEffect(() => {updateScores(environment);}, [environment.newScore]);
  //  React.useEffect(() => {updateHits(environment);}, [environment.newHit]);


    return (
        <div className="body">
            <div className="page-info">
                <link rel="icon" href="delver.png" />
                <title>Play Starsight</title>
            </div>
            <header>
                <h1>Play Starsight</h1>
                <Navbar />
            </header>

            <main className="game">
                <section className="sidebar">
                    <h2 className="head">Scores summary</h2>
                    <h2 className="subhead">(lower scores are better)</h2>
                    <div className="scores">
                        <section>
                            <h3 className="game-page">Most recent score:</h3>
                            <div ref={environment.currentScoreRef} className="number-area" name="current-score">
                                <p className="score number">{environment.newScore}</p>
                                <p ref={environment.latestScoreSideRef} className="score-side-text">New personal best!</p>
                            </div>
                            <div ref={environment.shareButtonRef} className="share">Share:
                                <a href="https://facebook.com/groups/845183421175823">
                                    <img src="fb_logo.png" alt="Facebook logo" width="23" />
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
                                <p ref={environment.personalBestHitRef} className="hit number personal"></p>
                                <p ref={environment.personalBestHitSideRef} className="hit-side-text new-best">
                                    New record!
                                </p>
                            </div>
                        </section>
                        <section>
                            <h3 className="game-page">Overall best hit:</h3>
                            <div className="number-area">
                                <p ref={environment.overallBestHitRef} className="hit number overall"></p>
                                <p ref={environment.bestHitSetterRef} className="hit-side-text"></p>
                            </div>
                        </section>
                    </div>
                    <div className="errorMsg bad" ref={environment.gameErrorMsgRef}></div>
                </section>

                <section className="window">
                    <canvas ref={windowRef} alt="Game window" className="unclicked"
                        width={windowSize[0]} height={windowSize[1]} id="gameWindow"
                        onClick={(event) => {
                            if (!environment.started) {
                                runGame(windowRef, environment, assetsMap);
                                loadAssets(environment, assetsMap, img_names);
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
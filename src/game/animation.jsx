import {resetStyling} from "./updateScores.jsx";
import * as howl from "howler";

const pi = 3.14159265358979;
const shrinkFactor = 0.9;
export const windowSize = [880, 560];
const LLRed = "rgb(255, 100, 70)";
const destructorYellow = "rgb(255, 255, 200)";
const steeringCenter = [400 / shrinkFactor, 280 / shrinkFactor];

const readyAssets = Object();
const frameData = Object();

var musicSilent, firstLoop, musicPauseState, musicPausedForDeathText;

function vectSum(vect1, vect2) {
    return [vect1[0] + vect2[0], vect1[1] + vect2[1]];
}

function drawLine(canvas, color, pos1, pos2, width) {
    canvas.strokeStyle = color;
    canvas.lineWidth = width;
    canvas.beginPath();
    canvas.moveTo(pos1[0], pos1[1]);
    canvas.lineTo(pos2[0], pos2[1]);
    canvas.stroke();
}

function drawCentered(canvas, img, pos) {
    canvas.drawImage(img, pos[0] - (img.width / 2), pos[1] - (img.height / 2));
}

function drawModified(canvas, img, pos, rotationAngle, scale_factor, is_deg) {
    var angleRad = rotationAngle;
    if (is_deg) {
        angleRad = pi * rotationAngle / 180;
    }
    canvas.save();
    canvas.translate(pos[0], pos[1]);
    canvas.rotate(angleRad);
    canvas.scale(scale_factor[0], scale_factor[1]);
    drawCentered(canvas, img, [0, 0]);

    canvas.restore();
}

function drawLineQuick(canvas, pos1, pos2) {
    canvas.beginPath();
    canvas.moveTo(pos1[0], pos1[1]);
    canvas.lineTo(pos2[0], pos2[1]);
    canvas.stroke();
}

function drawCircle(canvas, color, pos, radius) {
    canvas.beginPath();
    canvas.strokeStyle = color;
    canvas.arc(pos[0], pos[1], radius, 0, 2*pi);
    canvas.fillStyle = color;
    canvas.fill();
}

function loadAssetsProm(imgNames) {
    var images = new Array(imgNames.length).fill(null);
    var promises = new Array(imgNames.length + 2).fill(null);

    for (let i = 0; i < imgNames.length; i++) {
        images[i] = new Image();
        images[i].src = "assets/" + imgNames[i] + ".png";
        promises[i] = new Promise((resolve, reject) => {
            images[i].onload = () => {resolve(images[i]);};
        });
    }

    var sfx = new howl.Howl(
        {
            src: "assets/sfx.mp3",
            sprite: {
                E: [0, 2408], // E
                e: [2409, 1639], // explosion
                k: [4048, 310], // krell shot
                d: [4358, 84], // destructor
                l: [4442, 181], // light-lance attached
                L: [4623, 523], // light-lance fired
                r: [5146, 361], // rock destroyed
                w: [5507, 973] // wilhelm scream
            }
        }
    );
    
    var music = new howl.Howl(
        {
            src: "assets/music.mp3", 
            sprite: {
                with_intro: [0, 87966],
                main: [20141, 67825],
                silence: [87966, 453]
            },
            onend: () => {
                if (musicSilent) {
                    music.play("main");
                }
                else {
                    sfx.play("E");
                    music.play("silence");
                }
                musicSilent = !musicSilent;
            }
        }
    );

    promises[imgNames.length] = new Promise((resolve, reject) => {
        music.on("load", () => {resolve(music);});
    });

    promises[imgNames.length + 1] = new Promise((resolve, reject) => {
        sfx.on("load", () => {resolve(sfx);});
    });

    return Promise.all(promises);
}

export function loadAssets(environment, assetsRef, img_names) {
    var assetsProm = loadAssetsProm(img_names);

    assetsProm.then((assets) => {
        for (let i = 0; i < img_names.length; i++) {
            assetsRef[img_names[i]] = assets[i];
        }

        assetsRef["music"] = assets[assets.length - 2];
        assetsRef["sfx"] = assets[assets.length - 1];
        
        musicSilent = false;
        firstLoop = true;
        environment.loaded = true;
        musicPausedForDeathText = false;
    });
}

export function loadThumbnail() {
    const thumbnail = new Image();
    thumbnail.src = "assets/thumbnail.png";

    const play_button = new Image();
    play_button.src = "assets/play_button.png";

    const thumbnail_loaded = new Promise(
        (resolve, reject) => {thumbnail.onload = resolve(thumbnail);}
    );

    const play_button_loaded = new Promise(
        (resolve, reject) => {play_button.onload = resolve(play_button);}
    );

    return Promise.all([thumbnail_loaded, play_button_loaded]);
}

function drawPlayArrow(assets, gameWindow) {
    gameWindow.globalAlpha = 0.6;
    gameWindow.drawImage(
        assets.play_button, 
        (windowSize[0] - assets.buttonSize) / 2, 
        (windowSize[1] - assets.buttonSize) / 2, 
        assets.buttonSize, assets.buttonSize
    );
    gameWindow.globalAlpha = 1;
}

function drawText(gameWindow, text, color, font, pos, maxWidth) {
    gameWindow.fillStyle = color;
    gameWindow.font = font;
    gameWindow.fillText(text, pos[0], pos[1], maxWidth);
}

function rightKeyText(gameWindow) {
    drawText(gameWindow, "Press the right arrow key to continue", "white", 
        "bold 18px Consolas", [257, 540], 600);
}

function parseSingleCoord(coordStr) {
    return parseInt(coordStr, 36) - 97;
}

function parseNum(numStr) {
    return parseInt(numStr, 36);
}

function parseCoords(coordsStr, length) {
    if (coordsStr.length > 0) {
        return [parseSingleCoord(coordsStr.slice(0, length)), 
            parseSingleCoord(coordsStr.slice(length, length * 2))];
    }
    else {
        return null;
    }
}

function distance(pos1, pos2) {
    return Math.sqrt((pos1[1] - pos2[1])**2 + (pos1[0] - pos2[0])**2);
}

function parseDestructors(destructorsStr) {
    var destructors = [];
    for (let i = 0; i < destructorsStr.length; i += 8) {
        var thisDestr = [parseCoords(destructorsStr.slice(i, i + 4), 2), 
            parseCoords(destructorsStr.slice(i + 4, i + 8), 2)];
        destructors.push(thisDestr);
    }

    return destructors;
}

function parseAsteroids(asterStr) {
    var asteroids = [];
    for (let i = 0; i < asterStr.length; i+= 4) {
        var thisAster = parseCoords(asterStr.slice(i, i + 4), 2);
        asteroids.push(thisAster);
    }

    return asteroids;
}

function parseExplosions(explStr, is_on_top) { /* is_on_top represents whether the explosion 
    is rendered on top of the mothership or below, because it's encoded differently depending 
    on that because... long story.*/
    let [coordLen, sizeLen] = is_on_top ? [2, 3] : [3, 2];
    var explosions = [];
    for (let i = 0; i < explStr.length; i += 7 + !is_on_top) {
        let thisExpl = new Object();
        thisExpl.size = parseInt(explStr.slice(i, i + sizeLen), 36);
        thisExpl.pos = parseCoords(explStr.slice(i + sizeLen, i + 7 + !is_on_top), coordLen);
        explosions.push(thisExpl);
    }
    
    return explosions;
}

function parseData(environment) {
    var rawString = environment.renderingStr;
    var frameStrings = rawString.split(",");

    frameData.won = false;

    if (frameStrings.length === 1) {
        //console.log(frameStrings[0]);
        frameData.won = true;
        frameData.deaths = parseInt(frameStrings[0], 36);
        return;
    }
    if (frameStrings[0].length > 4) {
        frameData.shipPos = parseCoords(frameStrings[0], 3);
    }
    else {
        frameData.shipPos = parseCoords(frameStrings[0], 2);
    }
    frameData.shipAngle = parseNum(frameStrings[1].slice(0, 2));
    frameData.LLArrow = parseInt(frameStrings[1].slice(2, 3)) * 45;
    frameData.LLTip = parseCoords(frameStrings[2], 3);
    frameData.accel_magnitude = parseInt(frameStrings[3], 36);
    frameData.krellshot = [parseCoords(frameStrings[4], 3), parseCoords(frameStrings[4].slice(6, 12), 3)];
    frameData.destructors = parseDestructors(frameStrings[5]);
    frameData.asteroids = parseAsteroids(frameStrings[6]);
    frameData.explosionsBottom = parseExplosions(frameStrings[7], false);
    frameData.shieldAngle = parseInt(frameStrings[8], 36);
    frameData.explosionsTop = parseExplosions(frameStrings[9], true);
    frameData.status = parseInt(frameStrings[10], 36);
    frameData.deaths = parseInt(frameStrings[11], 36);
    if (!isNaN(frameData.deaths) && frameStrings[11][frameStrings[11].length - 1] === "|") {
        frameData.won = true;
    }

    return;
}

function deathText(environment, gameWindow, deaths, is_win) {
    let plural = (deaths !== 1);
    let times = plural ? " times." : " time.";
    if (is_win) {
        drawText(gameWindow, "Game finished! You died", 
            "rgb(0, 255, 0)", "normal 60px Cambria", [100, 158], 800);
        gameWindow.fillText("a total of " + deaths + times, 100, 218, 800);
    }
    else {
        drawText(gameWindow, "You have died " + deaths + times, 
            "rgb(0, 255, 0)", "normal 60px Cambria", [100, 158], 800);
    }
}

export function playSounds(assets, soundStr) {
    for (let i = 0; i < soundStr.length; i++) {
        assets.sfx.play(soundStr[i]);
    }
}

function beginMusic(environment, assets) {
    /* Play music from the beginning. If music is disabled at the moment, set it to play from
    the beginning once resumed. If it was already playing, start over. */
    stopMusic(assets);

    musicPauseState = 0;
    assets.music.play("with_intro");
    if (!environment.musicEnabled) {
        assets.music.pause();
        musicPauseState = 1;
    }
}

function stopMusic(assets) {
    if (musicPauseState !== 2) {
        assets.music.stop();
        musicPauseState = 2;
    }
}

function pauseMusic(assets) {
    if (!musicPauseState) {
        assets.music.pause();
        musicPauseState = 1;
    }
}

function resumeMusic(environment, assets) {
    if (environment.musicEnabled && !musicPausedForDeathText && musicPauseState === 1) {
        assets.music.play();
        musicPauseState = 0;
    }
}

function render(environment, gameWindow, assets) {
    parseData(environment);

    if (environment.restarting) {
        reset(environment, assets);
        environment.restarting = false;
    }
    if (frameData.won) {
        musicPausedForDeathText = true;
        stopMusic(assets);
        environment.won = true;
    }
    else {
        if (environment.won) {
            reset(environment, assets);
        }
    }
    let shieldUp = !isNaN(frameData.shieldAngle);

    gameWindow.drawImage(readyAssets.background, 0, 0, 
        windowSize[0] / shrinkFactor, windowSize[1] / shrinkFactor);
    if (!isNaN(frameData.LLArrow)) {
        drawModified(gameWindow, assets.arrow, frameData.shipPos, 
            frameData.shipAngle - frameData.LLArrow, [1, 1], true);
    }
    if (frameData.LLTip) {
        drawLine(gameWindow, LLRed, frameData.shipPos, frameData.LLTip, 2);
    }
    if (frameData.krellshot[0]) {
        drawLine(gameWindow, destructorYellow, frameData.krellshot[0], frameData.krellshot[1], 6);
    }
    if (frameData.shipPos) {
        let angleRad = frameData.shipAngle * pi / 180;
        drawModified(gameWindow, assets.flame,
            [Math.round(frameData.shipPos[0] - readyAssets.back * Math.cos(angleRad)),
            Math.round(frameData.shipPos[1] - readyAssets.back * Math.sin(angleRad))],
            frameData.shipAngle, [frameData.accel_magnitude / (assets.flame.width * 5), 0.5], 
            true);
        drawModified(gameWindow, readyAssets.ship, frameData.shipPos, frameData.shipAngle, 
            [0.3333, 0.3333], true);
    }
    for (let i = 0; i < frameData.destructors.length; i++) {
        drawLine(gameWindow, destructorYellow, frameData.destructors[i][0], 
            frameData.destructors[i][1], 3);
    }
    for (let i = 0; i < frameData.asteroids.length; i++) {
        drawCentered(gameWindow, assets.rock, frameData.asteroids[i]);
    }
    for (let i = 0; i < frameData.explosionsBottom.length; i++) {
        let scale_factor = frameData.explosionsBottom[i].size / 500;
        drawModified(gameWindow, assets.explosion_img, frameData.explosionsBottom[i].pos, 
            0, [scale_factor, scale_factor], true);
    }
    if (shieldUp) {
        drawModified(gameWindow, assets.bubble, [690, 390], -frameData.shieldAngle,
            [1, 1], true);
    }
    drawCentered(gameWindow, assets.krell, [600, 390]);
    if (shieldUp) {
        drawModified(gameWindow, assets.bubble, [690, 390], frameData.shieldAngle,
            [1, 1], true);
    }
    if (!environment.brakeOn) {
        drawModified(gameWindow, assets.arrow, steeringCenter, frameData.shipAngle, 
            [frameData.accel_magnitude / 121, 1], true);
    }
    drawCircle(gameWindow, "white", steeringCenter, 5);
    drawCircle(gameWindow, "black", steeringCenter, 1);
    for (let i = 0; i < frameData.explosionsTop.length; i++) {
        let scale_factor = frameData.explosionsTop[i].size / 500;
        drawModified(gameWindow, assets.explosion_img, frameData.explosionsTop[i].pos, 
            0, [scale_factor, scale_factor], true);
    }
    let statusStr = shieldUp ? "Krell shield: " : "Krell ship health: ";
    drawText(gameWindow, statusStr + frameData.status, "red", "bold 20px Courier",
        [70, 67], 400);

    if (!isNaN(frameData.deaths)) {
        musicPausedForDeathText = true;
        pauseMusic(assets);
        deathText(environment, gameWindow, frameData.deaths, frameData.won);
    }
    else {
        musicPausedForDeathText = false;
        resumeMusic(environment, assets);
    }

    if (environment.framesSinceMusicChange < 110) {
        if (environment.framesSinceMusicChange === 0) {
            readyAssets.music = environment.musicEnabled ? assets.music_on : assets.music_off;
            if (environment.musicEnabled) {
                resumeMusic(environment, assets);
            }
            else {
                pauseMusic(assets);
            }
        }
        drawCentered(gameWindow, readyAssets.music, [440 / shrinkFactor, 200 / shrinkFactor]);
    }
    environment.framesSinceMusicChange++;
}

function reset(environment, assets) {
    readyAssets.background = assets["background" + Math.ceil(Math.random() * 3)];
    resetStyling(environment);
    beginMusic(environment, assets);
    musicPausedForDeathText = false;
    musicSilent = false;
    environment.won = false;
}

export function updateGraphicsP0(assets, gameWindow, environment) {
    gameWindow.drawImage(assets.thumbnail, 0, 0, windowSize[0], windowSize[1]);
    if (!(environment.started)) {
        drawPlayArrow(assets, gameWindow);
    }
    else {
        drawText(gameWindow, "Loading...", "white", "50px starsight", [345, 540], 600);
    }
    if (!environment.keepAnimating) {
        return;
    }
    if (environment.loaded && environment.connected) {
        requestAnimationFrame((frameEnd) => {updateGraphicsP1(frameEnd, assets, gameWindow, environment, frameEnd);});
        return;
    }

    requestAnimationFrame((frameEnd) => {updateGraphicsP0(assets, gameWindow, environment);});
    return;
}

function updateGraphicsP1(prevFrame, assets, gameWindow, environment, pageBeginTime) {
    gameWindow.fillStyle = "black";
    gameWindow.fillRect(0, 0, windowSize[0], windowSize[1]);
    gameWindow.drawImage(assets.logo, (windowSize[0] - 700) / 2, (windowSize[1] - 202) / 2, 700, 202);

    if (!environment.keepAnimating) {
        return;
    }
    if (prevFrame - pageBeginTime < 2000) {
        requestAnimationFrame((frameEnd) => {updateGraphicsP1(frameEnd, assets, gameWindow, environment, pageBeginTime);});
    }
    else {
        environment.advance = false;
        environment.choosingShip = true;
        requestAnimationFrame((frameEnd) => {updateGraphicsP2(assets, gameWindow, environment);});
    }

    return;
}

function updateGraphicsP2(assets, gameWindow, environment) {
    gameWindow.drawImage(assets.choose_ship, 0, 0,  windowSize[0], windowSize[1]);

    if (!environment.keepAnimating) {
        return;
    }
    if (!environment.shipChoice) {
        requestAnimationFrame((frameEnd) => {updateGraphicsP2(assets, gameWindow, environment);});
    }
    else {
        if (environment.shipChoice == "p") {
            readyAssets.ship = assets.poco;
            readyAssets.back = 25;
        }
        else if (environment.shipChoice == "m") {
            readyAssets.ship = assets["m-bot"];
            readyAssets.back = 24;
        }
        readyAssets.background = assets["background" + Math.ceil(Math.random() * 3)];
        requestAnimationFrame((frameEnd) => {updateGraphicsP3(assets, gameWindow, environment);});
    }

    return;
}

function updateGraphicsP3(assets, gameWindow, environment) {
    gameWindow.drawImage(assets.intro_screen, 0, 0,  windowSize[0], windowSize[1]);
    rightKeyText(gameWindow);

    if (!environment.keepAnimating) {
        return;
    }
    if (!environment.advance) {
        requestAnimationFrame((frameEnd) => {updateGraphicsP3(assets, gameWindow, environment);});
    }
    else {
        environment.advance = false;
        environment.goBack = false;
        requestAnimationFrame((frameEnd) => {updateGraphicsP4(assets, gameWindow, environment);});
    }

    return;
}

function updateGraphicsP4(assets, gameWindow, environment) {
    gameWindow.drawImage(assets.controls, 0, 0,  windowSize[0], windowSize[1]);
    rightKeyText(gameWindow);

    if (!environment.keepAnimating) {
        return;
    }
    if (environment.goBack) {
        environment.goBack = false;
        environment.advance = false;
        requestAnimationFrame((frameEnd) => {updateGraphicsP3(assets, gameWindow, environment);});
    }
    else if (!environment.advance) {
        requestAnimationFrame((frameEnd) => {updateGraphicsP4(assets, gameWindow, environment);});
    }
    else {
        environment.goBack = false;
        environment.advance = false;
        environment.onMainGameScreen = true;
        if (firstLoop) {
            //musicPauseState = 2
            beginMusic(environment, assets);
            firstLoop = false;
        }
        else {
            resumeMusic(environment, assets);
        }
        requestAnimationFrame((frameEnd) => {updateGraphicsP5(assets, gameWindow, environment);});
    }

    return;
}

function updateGraphicsP5(assets, gameWindow, environment) {
    var renderStr = environment.renderingStr;
    if (renderStr) {
        gameWindow.scale(shrinkFactor, shrinkFactor);
        render(environment, gameWindow, assets);
        gameWindow.restore();
        gameWindow.save();
    }

    if (!environment.keepAnimating) {
        return;
    }

    if (!environment.goBack || environment.won) {
        environment.goBack = false;
        requestAnimationFrame((frameEnd) => {updateGraphicsP5(assets, gameWindow, environment);});
    }
    else {
        environment.goBack = false;
        environment.advance = false;
        environment.onMainGameScreen = false;
        environment.framesSinceMusicChange = 111;
        pauseMusic(assets);
        requestAnimationFrame((frameEnd) => {updateGraphicsP4(assets, gameWindow, environment);});
    }
    return;
}

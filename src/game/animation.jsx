import {resetVariables} from "./updateScores.jsx";

const pi = 3.14159265358979;
export const windowSize = [880, 560];

const readyAssets = Object();

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

function loadAssetsProm(imgNames, soundNames) {
    var images = new Array(imgNames.length).fill(null);
    var sounds = new Array(soundNames.length).fill(null);
    var promises = new Array(imgNames.length + soundNames.length).fill(null);

    for (let i = 0; i < imgNames.length; i++) {
        images[i] = new Image();
        images[i].src = "assets/" + imgNames[i] + ".png";
        promises[i] = new Promise((resolve, reject) => {
            images[i].onload = () => {resolve(images[i]);};
        });
    }

    for (let i = 0; i < soundNames.length; i++) {
        sounds[i] = new Audio("assets/" + soundNames[i] + ".mp3");
        promises[imgNames.length + i] = new Promise((resolve, reject) => {
            sounds[i].onloadeddata = () => {resolve(sounds[i]);};
        });
    }

    return Promise.all(promises);
}

export function loadAssets(environment, assetsRef, img_names, sound_names) {
    var assetsProm = loadAssetsProm(img_names, sound_names);

    assetsProm.then((assets) => {
        for (let i = 0; i < img_names.length; i++) {
            assetsRef[img_names[i]] = assets[i];
        }
        
        for (let i = 0; i < sound_names.length; i++) {
            assetsRef[sound_names[i]] = assets[img_names.length + i];
        }
        
        environment.loaded = true;
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

function displayLoadingText(gameWindow) {
    gameWindow.fillStyle = "white";
    gameWindow.font = "50px starsight";
    gameWindow.fillText("Loading...", 345, 540, 600);
}

function rightKeyText(gameWindow) {
    gameWindow.fillStyle = "white";
    gameWindow.font = "bold 18px Consolas";
    gameWindow.fillText("Press the right arrow key to continue", 257, 540, 600);
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

function parseData(environment) {
    var frameStrings = environment.renderingStr.split(",");
    var frameData = Object();
    frameData.shipPos = parseCoords(frameStrings[0], 2);
    frameData.shipAngle = parseNum(frameStrings[1].slice(0, 2));
    frameData.LLArrow = parseInt(frameStrings[1].slice(2, 3)) * 45;
    frameData.LLTip = parseCoords(frameStrings[2], 3);
    frameData.accel_magnitude = parseInt(frameStrings[3], 36);
    return frameData;
}

function render(environment, gameWindow, assets) {
    var frameData = parseData(environment);
    gameWindow.drawImage(readyAssets.background, 0, 0, windowSize[0], windowSize[1]);
    if (frameData.shipPos) {
        drawModified(gameWindow, readyAssets.ship, frameData.shipPos, frameData.shipAngle, 
            [0.3333, 0.3333], true);
    }
    drawModified(gameWindow, assets.arrow, [550, 425], frameData.shipAngle, 
        [frameData.accel_magnitude / 121, 1], true);
}

export function updateGraphicsP0(assets, gameWindow, environment) {
    gameWindow.drawImage(assets.thumbnail, 0, 0, windowSize[0], windowSize[1]);
    if (!(environment.started)) {
        drawPlayArrow(assets, gameWindow);
    }
    else {
        displayLoadingText(gameWindow);
    }
    if (!environment.keepAnimating.current) {
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

    if (!environment.keepAnimating.current) {
        return;
    }
    if (prevFrame - pageBeginTime < 500) {
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

    if (!environment.keepAnimating.current) {
        return;
    }
    if (!environment.shipChoice) {
        requestAnimationFrame((frameEnd) => {updateGraphicsP2(assets, gameWindow, environment);});
    }
    else {
        if (environment.shipChoice == "p") {
            readyAssets.ship = assets.poco;
        }
        else if (environment.shipChoice == "m") {
            readyAssets.ship = assets["m-bot"];
        }
        requestAnimationFrame((frameEnd) => {updateGraphicsP3(assets, gameWindow, environment);});
    }

    return;
}

function updateGraphicsP3(assets, gameWindow, environment) {
    gameWindow.drawImage(assets.intro_screen, 0, 0,  windowSize[0], windowSize[1]);
    rightKeyText(gameWindow);

    if (!environment.keepAnimating.current) {
        return;
    }
    if (!environment.advance) {
        requestAnimationFrame((frameEnd) => {updateGraphicsP3(assets, gameWindow, environment);});
    }
    else {
        environment.advance = false;
        readyAssets.background = assets["background" + Math.ceil(Math.random() * 3)];
        requestAnimationFrame((frameEnd) => {updateGraphicsP4(assets, gameWindow, environment);});
    }

    return;
}

function updateGraphicsP4(assets, gameWindow, environment) {
    gameWindow.drawImage(assets.controls, 0, 0,  windowSize[0], windowSize[1]);
    rightKeyText(gameWindow);

    if (!environment.keepAnimating.current) {
        return;
    }
    if (!environment.advance) {
        requestAnimationFrame((frameEnd) => {updateGraphicsP4(assets, gameWindow, environment);});
    }
    else {
        environment.advance = false;
        requestAnimationFrame((frameEnd) => {updateGraphicsP5(assets, gameWindow, environment);});
    }

    return;
}

function updateGraphicsP5(assets, gameWindow, environment) {
    //environment.score -= 1;
    if (environment.renderingStr) {
        render(environment, gameWindow, assets);
    }
    let mouse = environment.mousePos;
//    let angle = environment.LLAngle;
/*     if (environment.brake) {
        angle += pi;
    } */

    if (environment.rightClick) {
//        drawLine(gameWindow, "rgb(255, 100, 70)", mouse, vectSum(mouse, [Math.cos(angle) * 100, Math.sin(angle) * 100]), 3);
    }
    gameWindow.fillStyle = "rgb(0, 220, 130)";
    gameWindow.font = "20px Consolas";
    gameWindow.fillText("Score: " + environment.score, 50, 35);

    gameWindow.fillStyle = "rgb(0, 220, 130)";
    gameWindow.font = "20px Consolas";
    //gameWindow.fillText("Hit placeholder: " + environment.slashPresses, 600, 35);

    if (!environment.keepAnimating.current) {
        return;
    }
    if (!environment.advance) {
        requestAnimationFrame((frameEnd) => {updateGraphicsP5(assets, gameWindow, environment);});
    }
    else {
        environment.advance = false;
        requestAnimationFrame((frameEnd) => {updateGraphicsP6(assets, gameWindow, environment);});
    }
    return;
}

function updateGraphicsP6(assets, gameWindow, environment) {
    gameWindow.fillStyle = "black";
    gameWindow.fillRect(0, 0, windowSize[0], windowSize[1]);
    gameWindow.fillStyle = "rgb(0, 220, 130)";
    gameWindow.font = "60px Consolas";
    gameWindow.fillText("Score: " + environment.score, 240, 300);
    environment.setNewScore(environment.score);
    //environment.setNewHit(environment.slashPresses);

    if (!environment.keepAnimating.current) {
        return;
    }
    if (!environment.advance) {
        requestAnimationFrame((frameEnd) => {updateGraphicsP6(assets, gameWindow, environment);});
    }
    else {
        resetVariables(environment);
        requestAnimationFrame((frameEnd) => {updateGraphicsP3(assets, gameWindow, environment);});
    }
}

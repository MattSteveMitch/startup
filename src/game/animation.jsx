import {resetVariables} from "./updateScores.jsx";

const pi = 3.14159265358979;
export const windowSize = [880, 560];
const LLRed = "rgb(255, 100, 70)";
const destructorYellow = "rgb(255, 255, 200)";

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

function drawCircle(canvas, color, pos, radius) {
    canvas.beginPath();
    canvas.strokeStyle = color;
    canvas.arc(pos[0], pos[1], radius, 0, 2*pi);
    canvas.fillStyle = color;
    canvas.fill();
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
    var frameStrings = environment.renderingStr.split(",");

    var frameData = Object();
    frameData.won = false;

    if (frameStrings.length === 1) {
        frameData.won = true;
        frameData.deaths = parseInt(frameStrings[0], 36);
        return frameData;
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
    return frameData;
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

function render(environment, gameWindow, assets) {
    var frameData = parseData(environment);
    if (frameData.won) {
        if (!environment.won) {
            deathText(environment, gameWindow, frameData.deaths, true);
            environment.won = true;
        }
        return;
    }
    else {
        environment.won = false;
    }
    let shieldUp = !isNaN(frameData.shieldAngle);

    gameWindow.drawImage(readyAssets.background, 0, 0, windowSize[0], windowSize[1]);
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
        drawModified(gameWindow, readyAssets.ship, frameData.shipPos, frameData.shipAngle, 
            [0.3333, 0.3333], true);
        let angleRad = frameData.shipAngle * pi / 180;
        drawModified(gameWindow, assets.flame,
            [Math.round(frameData.shipPos[0] - readyAssets.back * Math.cos(angleRad)),
            Math.round(frameData.shipPos[1] - readyAssets.back * Math.sin(angleRad))],
            frameData.shipAngle, [frameData.accel_magnitude / (assets.flame.width * 5), 0.5], 
            true);
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
        drawModified(gameWindow, assets.arrow, [550, 425], frameData.shipAngle, 
            [frameData.accel_magnitude / 121, 1], true);
    }
    drawCircle(gameWindow, "white", [550, 425], 5);
    drawCircle(gameWindow, "black", [550, 425], 1);
    for (let i = 0; i < frameData.explosionsTop.length; i++) {
        let scale_factor = frameData.explosionsTop[i].size / 500;
        drawModified(gameWindow, assets.explosion_img, frameData.explosionsTop[i].pos, 
            0, [scale_factor, scale_factor], true);
    }
    let statusStr = shieldUp ? "Krell shield: " : "Krell ship health: ";
    drawText(gameWindow, statusStr + frameData.status, "red", "bold 20px Courier",
        [70, 67], 400);

    if (!isNaN(frameData.deaths)) {
        deathText(environment, gameWindow, frameData.deaths, false);
    }
}

export function updateGraphicsP0(assets, gameWindow, environment) {
    gameWindow.drawImage(assets.thumbnail, 0, 0, windowSize[0], windowSize[1]);
    if (!(environment.started)) {
        drawPlayArrow(assets, gameWindow);
    }
    else {
        drawText(gameWindow, "Loading...", "white", "50px starsight", [345, 540], 600);
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

    if (!environment.keepAnimating.current) {
        return;
    }
    if (!environment.shipChoice) {
        requestAnimationFrame((frameEnd) => {updateGraphicsP2(assets, gameWindow, environment);});
    }
    else {
        if (environment.shipChoice == "p") {
            readyAssets.ship = assets.poco;
            readyAssets.back = 29;
        }
        else if (environment.shipChoice == "m") {
            readyAssets.ship = assets["m-bot"];
            readyAssets.back = 24;
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
        environment.goBack = false;
        environment.advance = false;
        requestAnimationFrame((frameEnd) => {updateGraphicsP5(assets, gameWindow, environment);});
    }

    return;
}

function handleError(error, gameWindow, environment, renderStr) {
    console.log(error);
    console.log("Rendering data: \"" + renderStr + "\"");
    gameWindow.fillStyle = "black";
    gameWindow.fillRect(-1, -1, 1110, 710);
    drawText(gameWindow, "Rendering error; see debug console for details.", "red", 
        "bold 24px Consolas", [50, 200], 700);
    gameWindow.fillText("Please email details to mattstevemitch@gmail.com.", 50, 230, 700);
    drawText(gameWindow, "Rendering data: \"" + renderStr + "\"", "red", 
        "bold 16px Consolas", [50, 260], 800);
    gameWindow.font = "bold 16px Consolas";
    environment.websocket.close();
    environment.connected = false;
}

function updateGraphicsP5(assets, gameWindow, environment) {
    var renderStr = environment.renderingStr;
    if (renderStr) {
        try {
            render(environment, gameWindow, assets);
        }
        catch (error) {
            handleError(error, gameWindow, environment, renderStr);
            return;
        }
    }

    if (!environment.keepAnimating.current) {
        return;
    }

    if (!environment.goBack || environment.won) {
        environment.goBack = false;
        requestAnimationFrame((frameEnd) => {updateGraphicsP5(assets, gameWindow, environment);});
    }
    else {
        environment.goBack = false;
        environment.advance = false;
        requestAnimationFrame((frameEnd) => {updateGraphicsP4(assets, gameWindow, environment);});
    }
    return;
}

const pi = 3.14159265358979;
export const windowSize = [880, 560];

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

function drawModified(canvas, img, pos, rotationAngle, is_deg) {
    var angleRad = rotationAngle;
    if (is_deg) {
        angleRad = pi * rotationAngle / 180;
    }
    canvas.save();
    canvas.translate(pos[0], pos[1]);
    canvas.rotate(angleRad);
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

export function loadAssets(assetsRef, img_names, sound_names, setLoaded) {
    var assetsProm = loadAssetsProm(img_names, sound_names);

    assetsProm.then((assets) => {
        for (let i = 0; i < img_names.length; i++) {
            assetsRef.current[img_names[i]] = assets[i];
        }
        
        for (let i = 0; i < sound_names.length; i++) {
            assetsRef.current[sound_names[i]] = assets[img_names.length + i];
        }
        
        setLoaded(true);
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

export function updateGraphicsP0(assets, gameWindow, environment) {
    gameWindow.drawImage(assets.thumbnail, 0, 0, windowSize[0], windowSize[1]);
    if (!(environment.started)) {
        gameWindow.globalAlpha = 0.6;
        gameWindow.drawImage(
            assets.play_button, 
            (windowSize[0] - assets.buttonSize) / 2, 
            (windowSize[1] - assets.buttonSize) / 2, 
            assets.buttonSize, assets.buttonSize
        );
        gameWindow.globalAlpha = 1;
    }
    if (environment.loaded) {
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

    if (prevFrame - pageBeginTime < 2000) {
        requestAnimationFrame((frameEnd) => {updateGraphicsP1(frameEnd, assets, gameWindow, environment, pageBeginTime);});
    }
    else {
        environment.setAdv(false);
        requestAnimationFrame((frameEnd) => {updateGraphicsP2(frameEnd, assets, gameWindow, environment);});
    }

    return;
}

function updateGraphicsP2(prevFrame, assets, gameWindow, environment, pageBeginTime) {
    gameWindow.drawImage(assets.intro_screen, 0, 0,  windowSize[0], windowSize[1]);
    gameWindow.fillStyle = "rgb(0, 220, 130)";
    gameWindow.font = "30px Consolas";
    gameWindow.fillText("Press the right arrow key to continue", 140, 540, 600);

    if (!environment.advance) {
        requestAnimationFrame((frameEnd) => {updateGraphicsP2(frameEnd, assets, gameWindow, environment, pageBeginTime);});
    }
    else {
        environment.setAdv(false);
        requestAnimationFrame((frameEnd) => {updateGraphicsP3(assets, gameWindow, environment);});
    }

    return;
}

function updateGraphicsP3(assets, gameWindow, environment) {
    environment.setScore(environment.score - 1);
    gameWindow.drawImage(assets.background2, 0, 0, windowSize[0], windowSize[1]);
    let mouse = environment.mousePos;
    let angle = environment.LLAngle;
    if (environment.brake) {
        angle += pi;
    }
            
    if (environment.rightClick) {
        drawLine(gameWindow, "rgb(255, 100, 70)", mouse, vectSum(mouse, [Math.cos(angle) * 100, Math.sin(angle) * 100]), 3);
    }
    drawModified(gameWindow, assets["m-bot"], mouse, angle, false);
    gameWindow.fillStyle = "rgb(0, 220, 130)";
    gameWindow.font = "20px Consolas";
    gameWindow.fillText("Score: " + environment.score, 50, 35);

    
    if (!environment.advance) {
        requestAnimationFrame((frameEnd) => {updateGraphicsP3(assets, gameWindow, environment);});
    }
    else {
        environment.setAdv(false);
        requestAnimationFrame((frameEnd) => {updateGraphicsP4(assets, gameWindow, environment);});
    }
    return;
}

function updateGraphicsP4(assets, gameWindow, environment) {
    gameWindow.fillStyle = "black";
    gameWindow.fillRect(0, 0, windowSize[0], windowSize[1]);
    gameWindow.fillStyle = "rgb(0, 220, 130)";
    gameWindow.font = "60px Consolas";
    gameWindow.fillText("Score: " + environment.score, 240, 300);
    environment.setNewScore(environment.score);
}

/*
    rotationangle += 3
    if alive:
        if SHIPTYPE == MBOT:
            graphicsstring = "m"
        else:
            graphicsstring = "p"
    else:
        graphicsstring = ""

    graphicsstring += str(round(pos[0])) + " " + str(round(pos[1])) + "\n" # Starts with position of the ship
    graphicsstring += str(round(angledeg)) + "\n" # The angle of the ship

#    graphicsstring += "b\n" # Render background on top of everything, erasing it all
    if framessincearrow<110:
        arrow = str((LLangle / 45) % 8) # Light-lance arrow is at the given angle

    shield = str(round(rotationangle)) # Shield is rotated at the given angle
    # Will hard-code on client side that shield should be rendered with its center at (690, 390), with
    # the other shield layer rotated at the opposite angle as this one

    if framessincearrow<110 and alive:
        graphicsstring += arrow
    graphicsstring += "\n"
    
    if LLactive:
        graphicsstring += str(round(LLtip[0])) + " " + str(round(LLtip[1]))
    graphicsstring += "\n"
    
    graphicsstring += str(round(magn(accel)*20000)) + "\n" # Magnitude of acceleration of the ship,
    # for the purposes of flame length and steering arrow length
    
    if krellshot!=None:
        graphicsstring += str(round(krellshot.pos1[0])) + " " + str(round(krellshot.pos1[1])) + "\n" + \
        str(round(krellshot.pos2[0])) + " " + str(round(krellshot.pos2[1]))
    graphicsstring += "\n"

    for this in destructors:
        graphicsstring += str(round(this.pos1[0])) + " " + str(round(this.pos1[1])) + " " + \
        str(round(this.pos2[0])) + " " + str(round(this.pos2[1])) + "\n"
    graphicsstring += "\n"

    for meteor in obstacles:
        if meteor.life and not meteor.offscreen:
            graphicsstring += str(round(meteor.pos[0])) + " " + str(round(meteor.pos[1])) + "\n"
    graphicsstring += "\n"

    for expl in explosions2:
        r, p = expl.radius, expl.pos
        graphicsstring += str(round(r)) + " " + str(round(p[0])) + " " + str(round(p[1])) + "\n"
    graphicsstring += "\n"

    if krell.shield > 0:
        graphicsstring += shield
    graphicsstring += "\n"

    for expl in explosions:
        r, p = expl.radius, expl.pos
        graphicsstring += str(round(r)) + " " + str(round(p[0])) + " " + str(round(p[1])) + "\n"
    graphicsstring += "\n"

    if krell.shield>0:
        status = str(math.ceil(krell.shield))
    else:
        status = str(math.ceil(krell.health))
    graphicsstring += status + "\n"

    if done or not krell.life:
        graphicsstring += "d"


#    graphicsstring += "\n----------------------------------------------------\n"
    sendgraphicsstring(graphicsstring)
*/
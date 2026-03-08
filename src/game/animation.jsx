const pi = 3.14159265358979;
export const windowSize = [880, 560];

function drawLine(canvas, color, pos1, pos2, width) {
    canvas.strokeStyle = color;
    canvas.lineWidth = width;
    canvas.beginPath();
    canvas.moveTo(pos1[0], pos1[1]);
    canvas.lineTo(pos2[0], pos2[1]);
    canvas.stroke();
}

/*function drawModified(canvas, img, pos, rotationAngle, is_deg, scaling_ratio) {
    var angleRad = rotationAngle;
    if (is_deg) {
        angleRad = pi * rotationAngle / 180;
    }
    canvas.translate(windowSize[0] / 2 - pos[0], windowSize[1] / 2 - pos[1]);
    canvas.rotate(-angleRad);
    
}*/

function drawLineQuick(canvas, pos1, pos2) {
    canvas.beginPath();
    canvas.moveTo(pos1[0], pos1[1]);
    canvas.lineTo(pos2[0], pos2[1]);
    canvas.stroke();
}

function loadImagesProm(names) {
    var images = new Array(names.length).fill(null);
    var promises = new Array(names.length).fill(null);

    for (let i = 0; i < names.length; i++) {
        images[i] = new Image();
        images[i].src = "assets/" + names[i] + ".png";
        promises[i] = new Promise((resolve, reject) => {
            images[i].onload = () => {resolve(images[i]);};
        });
    }

    return Promise.all(promises);
}

export function loadImages(graphicsRef, img_names, setLoaded) {
    var imagesProm = loadImagesProm(img_names);
    //console.log("before: " + Object.keys(graphicsRef.current).length);
    imagesProm.then((images) => {
        for (let i = 0; i < img_names.length; i++) {
            graphicsRef.current[img_names[i]] = images[i];
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

export function updateGraphics(graphics, gameWindow, eventsMap) {
    //console.log("gg " + graphics.background2);
    if (!(eventsMap.started)) {
        gameWindow.drawImage(graphics.thumbnail, 0, 0, windowSize[0], windowSize[1]);
        gameWindow.globalAlpha = 0.6;
        gameWindow.drawImage(
            graphics.play_button, 
            (windowSize[0] - graphics.buttonSize) / 2, 
            (windowSize[1] - graphics.buttonSize) / 2, 
            graphics.buttonSize, graphics.buttonSize
        );
        gameWindow.globalAlpha = 1;
    }
    else {
        if (eventsMap.started && eventsMap.loaded) {
            gameWindow.drawImage(graphics.background2, 0, 0, windowSize[0], windowSize[1]);;
            //console.log(eventsMap);
            let mouse = eventsMap.mousePos;
            gameWindow.drawImage(graphics["m-bot"], mouse[0], mouse[1]);
        }
        else {
            gameWindow.drawImage(graphics.thumbnail, 0, 0, windowSize[0], windowSize[1]);
        }
    }

    requestAnimationFrame(() => {updateGraphics(graphics, gameWindow, eventsMap);});
    return;
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
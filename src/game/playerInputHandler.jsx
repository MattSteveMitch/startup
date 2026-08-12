const pi = 3.14159265358979;
let keyStrings = {"Slash": "/", "Space": " ", "Enter": "R", "Backslash": "R", "KeyR": "r", 
    "ShiftLeft": "S", "ShiftRight": "S", "KeyS": "s", "ArrowRight": ">", "ArrowLeft": "S",
    "KeyP": "p", "KeyM": "m"
};

function pauseGame() {
    console.log("game paused!");
}

function advanceOne(environment) {
    environment.advance = true;
}

function goBack(environment) {
    environment.goBack = true;
}

function chooseShip(environment, ship) {
    if (environment.choosingShip) {
        environment.shipChoice = ship;
        environment.choosingShip = false;
    }
}

let clientActions = {
    "/": (environment) => {environment.shooting = true;}, 
    "S": goBack, "s": (_) => {console.log("sound toggled");}, 
    ">": advanceOne, "r": (environment) => {environment.restarting = true;},
    "p": (environment) => {chooseShip(environment, "p");}, 
    "m": (environment) => {chooseShip(environment, "m");},
    " ": (environment) => {environment.brakeOn = true;}
};

function sendEventWS(environment, message) {
    if (!environment.connected) {
        return;
    }
    environment.websocket.send(message + "\n");
}

export function handleKeyPress(event, environment, assets) {
    let keyStr = keyStrings[event.code];
    if (keyStr && !event.repeat) {
        sendEventWS(environment, "k" + keyStr);
        let clientAction = clientActions[keyStr];
        if (clientAction) {
            clientAction(environment);
        }
    }
}

export function handleKeyRelease(event, environment) {
    switch (event.code) {
        case "Slash":
            sendEventWS(environment, "l/");
            environment.shooting = false;
            break;
        case "Space":
            sendEventWS(environment, "l ");
            environment.brakeOn = false;
    }
}

export function handleMouseMove(newPos, environment) {
    let xStr = "0" + newPos.nativeEvent.offsetX.toString(36);
    let yStr = "0" + newPos.nativeEvent.offsetY.toString(36);
    sendEventWS(environment, "m" + xStr.slice(-2) + yStr.slice(-2));
    //environment.setMouse([newPos.nativeEvent.offsetX, newPos.nativeEvent.offsetY]);
}

export function handleScroll(event, environment) {
    if (event.deltaY < 0) {
        sendEventWS(environment, "+");
  //      environment.setLLAngle(environment.LLAngle - (pi / 4));
    }
    else {
        sendEventWS(environment, "-");
    //    environment.setLLAngle(environment.LLAngle + (pi / 4));
    }
}

export function handleClick(event, environment) {
    sendEventWS(environment, "(");
}
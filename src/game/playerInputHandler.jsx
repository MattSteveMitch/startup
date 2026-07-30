const pi = 3.14159265358979;
let keyStrings = {"Slash": "/", "Space": " ", "Enter": "R", "Backslash": "R", "KeyR": "r", 
    "ShiftLeft": "S", "ShiftRight": "S", "KeyS": "s", "ArrowRight": ">", "ArrowLeft": "<",
    "KeyP": "p", "KeyM": "m"
};

function pauseGame() {
    console.log("game paused!");
}

function advanceOne(environment) {
    environment.setAdv(true);
}

let clientActions = {
    "/": (environment) => {environment.toggleShooting(true);}, 
    "S": pauseGame, "s": (_) => {console.log("sound toggled");}, 
    ">": advanceOne, "<": (environment) => {environment.setGoBack(true);},
    "p": advanceOne, "m": advanceOne
};

function sendWSMessage(environment, message) {
    if (!environment.connected) {
        return;
    }
    environment.websocket.send(message);
}

export function handleKeyPress(event, environment, assets) {
    let keyStr = keyStrings[event.code];
    if (keyStr) {
        sendWSMessage(environment, "k" + keyStr);
        let clientAction = clientActions[keyStr];
        if (clientAction) {
            clientAction(environment);
        }
    }
}

export function handleKeyRelease(event, environment) {
    switch (event.code) {
        case "Slash":
            sendWSMessage(environment, "l/");
            environment.toggleShooting(false);
            break;
        case "Space":
            sendWSMessage(environment, "l ");
            environment.toggleBrake(false);
    }
}

export function handleMouseMove(newPos, environment) {
    let xStr = "0" + newPos.nativeEvent.offsetX.toString(36);
    let yStr = "0" + newPos.nativeEvent.offsetY.toString(36);
    sendWSMessage(environment, "m" + xStr.slice(-2) + yStr.slice(-2));
    //environment.setMouse([newPos.nativeEvent.offsetX, newPos.nativeEvent.offsetY]);
}

export function handleScroll(event, environment) {
    if (event.deltaY < 0) {
        sendWSMessage(environment, "+");
        environment.setLLAngle(environment.LLAngle - (pi / 4));
    }
    else {
        sendWSMessage(environment, "-");
        environment.setLLAngle(environment.LLAngle + (pi / 4));
    }
}

export function handleClick(event, environment) {
    sendWSMessage(environment, "(");
}
const pi = 3.14159265358979;
//let eventStrings = {"Slash": ""};

function sendWSMessage(environment, message) {
    environment.websocket.send(message);
}

export function handleKeyPress(event, environment, assets) {
    let eventStr;
    if (event.code) {
        sendWSMessage(environment, event.code);
    }
/*    switch (event.code) {
        case "Slash":
            
            //environment.toggleShooting(true);
            //environment.setSlashPresses(environment.slashPresses + 1);
            //assets.laser.play();
            break;
        case "Space":
            event.preventDefault();
            environment.toggleBrake(true);
            break;
        case "Enter":
            console.log("enter pressed");
            break;
        case "KeyR":
            console.log("r pressed");
            break;
        case "ShiftLeft":
        case "ShiftRight":
            console.log("shift pressed");
            break;
        case "KeyS":
            console.log("s pressed");
            break;
        case "ArrowRight":
            console.log("right pressed");
            environment.setAdv(true);
            break;
        case "ArrowLeft":
            console.log("left pressed");
            environment.setGoBack(true);
            break;
        case "KeyP":
            console.log("p pressed");
            break;
        case "KeyM":
            console.log("m pressed");
            break;
    }*/
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
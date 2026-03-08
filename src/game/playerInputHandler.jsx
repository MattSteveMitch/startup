export function handleKeyPress(event, eventsMap) {
    let x;
    switch (event.code) {
        case "Slash":
            eventsMap.toggleShooting(true);
            break;
        case "Space":
            eventsMap.toggleBrake(true);
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
            x = parseInt(localStorage.getItem("x"));
            localStorage.setItem("x", x + 20);
            console.log(localStorage.getItem("x"));
            break;
        case "ArrowLeft":
            console.log("right pressed");
            x = parseInt(localStorage.getItem("x"));
            localStorage.setItem("x", x - 20);
            console.log(localStorage.getItem("x"));
            break;
        case "KeyP":
            if (!localStorage.getItem("shipType")) {
                localStorage.setItem("shipType", "Poco");
            }
            console.log("p pressed");
            console.log(localStorage.getItem("shipType"));
            break;
        case "KeyM":
            if (!localStorage.getItem("shipType")) {
                localStorage.setItem("shipType", "M-Bot");
            }
            console.log("m pressed");
            console.log(localStorage.getItem("shipType"));
            break;
    }
}

export function handleKeyRelease(event, eventsMap) {
    switch (event.code) {
        case "Slash":
            eventsMap.toggleShooting(false);
            break;
        case "Space":
            eventsMap.toggleBrake(false);
    }
}

export function handleMouseMove(newPos, eventsMap) {
    //console.log("mouse: " + newPos.offsetX);
    eventsMap.setMouse([newPos.nativeEvent.offsetX, newPos.nativeEvent.offsetY]);
    //console.log(eventsMap.mousePos);
}

const pi = 3.14159265358979;

export function handleKeyPress(event, eventsMap, assets) {
    let x;
    switch (event.code) {
        case "Slash":
            eventsMap.toggleShooting(true);
            assets.laser.play();
            break;
        case "Space":
            event.preventDefault();
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
   // console.log("brake: " + eventsMap.brake);
    //console.log("shooting: " + eventsMap.shooting);
}

export function handleKeyRelease(event, eventsMap) {
    switch (event.code) {
        case "Slash":
            eventsMap.toggleShooting(false);
            break;
        case "Space":
            eventsMap.toggleBrake(false);
    }
//    console.log("brake: " + eventsMap.brake);
  //  console.log("shooting: " + eventsMap.shooting);
}

export function handleMouseMove(newPos, eventsMap) {
    eventsMap.setMouse([newPos.nativeEvent.offsetX, newPos.nativeEvent.offsetY]);
}

export function handleScroll(event, eventsMap) {
    if (event.deltaY < 0) {
        eventsMap.setLLAngle(eventsMap.LLAngle - (pi / 4));
    }
    else {
        eventsMap.setLLAngle(eventsMap.LLAngle + (pi / 4));
    }
}

export function handleClick(event, eventsMap) {
    console.log("clicked");
}
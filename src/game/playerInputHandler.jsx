const pi = 3.14159265358979;

export function handleKeyPress(event, environment, assets) {
    let x;
    switch (event.code) {
        case "Slash":
            environment.toggleShooting(true);
            environment.setSlashPresses(environment.slashPresses + 1);
            assets.laser.play();
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
    }
}

export function handleKeyRelease(event, environment) {
    switch (event.code) {
        case "Slash":
            environment.toggleShooting(false);
            break;
        case "Space":
            environment.toggleBrake(false);
    }
}

export function handleMouseMove(newPos, environment) {
    environment.setMouse([newPos.nativeEvent.offsetX, newPos.nativeEvent.offsetY]);
}

export function handleScroll(event, environment) {
    if (event.deltaY < 0) {
        environment.setLLAngle(environment.LLAngle - (pi / 4));
    }
    else {
        environment.setLLAngle(environment.LLAngle + (pi / 4));
    }
}

export function handleClick(event, environment) {
    console.log("clicked");
}
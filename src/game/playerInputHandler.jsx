const pi = 3.14159265358979;

export function handleKeyPress(event, environment, assets) {
    let x;
    switch (event.code) {
        case "Slash":
            environment.toggleShooting(true);
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
   // console.log("brake: " + environment.brake);
    //console.log("shooting: " + environment.shooting);
}

export function handleKeyRelease(event, environment) {
    switch (event.code) {
        case "Slash":
            environment.toggleShooting(false);
            break;
        case "Space":
            environment.toggleBrake(false);
    }
//    console.log("brake: " + environment.brake);
  //  console.log("shooting: " + environment.shooting);
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
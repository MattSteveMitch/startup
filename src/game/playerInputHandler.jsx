export function keyPress(event) {
    let x;
    switch (event.code) {
        case "Slash":
            console.log("slash pressed");
            break;
        case "Space":
            console.log("space pressed");
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

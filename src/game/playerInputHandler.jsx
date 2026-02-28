function drawLine(canvas, color, pos1, pos2, width) {
    canvas.strokeStyle = color;
    canvas.lineWidth = width;
    canvas.beginPath();
    canvas.moveTo(pos1[0], pos1[1]);
    canvas.lineTo(pos2[0], pos2[1]);
    canvas.stroke();
}


function drawLineQuick(canvas, pos1, pos2) {
    canvas.beginPath();
    canvas.moveTo(pos1[0], pos1[1]);
    canvas.lineTo(pos2[0], pos2[1]);
    canvas.stroke();
}

export function keyPress(event, window, y) {
    drawLine(window, "blue", [150, y], [220, y], 5);

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

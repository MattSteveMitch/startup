export function runGame(windowRef, environment) {
    windowRef.current.className = "";
    console.log("running");

    environment.setStarted(true);

    environment.websocket = new WebSocket(
        "ws://" + window.location.hostname + ":" + window.location.port + "/ws"
    );
    console.log(environment.websocket);

    environment.websocket.onmessage = (event) => {
        console.log("message: " + event.data);
        if (event.data === "This is server to client. Do you copy? Over.") {
            environment.websocket.send("This is client to server. I copy, over.");
        }
    };

    environment.websocket.onopen = (event) => {
        console.log("opened socket: " + event.data);
        environment.setConnected(true);
    };
}
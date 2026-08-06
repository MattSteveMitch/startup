export function runGame(windowRef, environment) {
    windowRef.current.className = "";
    console.log("running");

    environment.started = true;

    environment.websocket = new WebSocket(
        "ws://" + window.location.hostname + ":" + window.location.port + "/ws"
    );

    environment.websocket.onmessage = (event) => {
    //    console.log(event.data);
        environment.renderingStr = event.data;
    };

    environment.websocket.onopen = (event) => {
        environment.connected = true;
    };
}
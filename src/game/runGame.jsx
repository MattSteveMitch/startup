export function runGame(windowRef, environment) {
    windowRef.current.className = "";
    console.log("running");

    environment.started = true;

    environment.websocket = new WebSocket(
        "wss://" + window.location.hostname + ":" + window.location.port
    );
    console.log(environment.websocket);

    environment.websocket.onmessage = (event) => {
        //console.log(event.data);
        environment.renderingStr = event.data;
    };

    environment.websocket.onopen = (event) => {
        console.log("opened socket: " + event.data);
        environment.connected = true;
    };
}
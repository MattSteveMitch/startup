export function runGame(windowRef, environment) {
    windowRef.current.className = "";
    console.log("running");

 //   let port = window.location.port;
   // let domain = window.location.hostname;
    //console.log(domain);
    environment.websocket = new WebSocket(
        "ws://" + window.location.hostname + ":" + window.location.port + "/ws"
    );
    console.log(environment.websocket);

    environment.websocket.onmessage = (event) => {
        console.log("message: " + event.data);
    };

    environment.websocket.onopen = (event) => {
        console.log("opened socket: " + event.data);
    };
    environment.setStarted(true);
}

export function sendWSMessage(environment, message) {
    environment.websocket.send(message);
}
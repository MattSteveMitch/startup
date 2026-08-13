import {updateScores, updateHits, resetHitStyling} from "./updateScores.jsx";

const newScoreBestness = {"$": 0, "+": 1, "!": 2}; // Characters representing score bestnesses
const newHitBestness = {"*": 0, "#": 1, "@": 2}; // Characters representing hit bestnesses


export function runGame(windowRef, environment) {
    windowRef.current.className = "";
    console.log("running");

    environment.started = true;

    environment.websocket = new WebSocket(
        "wss://" + window.location.hostname + ":" + window.location.port
    );

    environment.websocket.onmessage = (event) => {
        //console.log(event.data);
        let scoreBestness = newScoreBestness[event.data[0]];
        let bestness = scoreBestness ?? newHitBestness[event.data[0]];
        if (bestness !== undefined) {
            if (scoreBestness !== undefined) {
                updateScores(environment, parseInt(event.data.slice(1), 36), bestness);
            }
            else {
                let hit = parseInt(event.data.slice(1), 36) / 10;
                resetHitStyling(environment);
                updateHits(environment, hit, bestness);
            }
        }
        else {
            environment.renderingStr = event.data;
        }
    };

    environment.websocket.onopen = (event) => {
        environment.connected = true;
    };
}
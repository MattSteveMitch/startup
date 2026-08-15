import {updateScores, updateHits, resetHitStyling} from "./updateScores.jsx";
import {playSounds} from "./animation.jsx";

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
            let strings = event.data.split(".");
            if (strings.length < 2) { // Frame data should end with a period
                console.log("Frame rendering error: " + event.data);
                return;
            }
            else {
                environment.renderingStr = strings[0];
                let soundStrings = strings[1].split("<");
                if (soundStrings.length < 2 || soundStrings[1].length != 0) { // Sound data should end with "<"
                    console.log("Sound error: " + strings[1]);
                }
                else {
                    playSounds(soundStrings[0]);
                }
            }
        }
    };

    environment.websocket.onopen = (event) => {
        environment.connected = true;
    };
}
import { addScore, nullish } from "../misc.jsx";

function setBestScore(environment, score, setter) {
    environment.overallBestScoreRef.current.innerHTML = score;
    environment.bestScoreSetterRef.current.innerHTML = "Set by " + setter;
}

function setBestHit(environment, hit, setter) {
    environment.overallBestHitRef.current.innerHTML = hit;
    environment.bestHitSetterRef.current.innerHTML = "Set by " + setter;
}

export function updateScores(environment) {
    let myUsername = localStorage.getItem("username");
    let bestness;

    if (!nullish(environment.newScore)) {
        fetch("/api/score", {
            method: "post",
            headers: { "Content-type": "application/json; charset=UTF-8" },
            body: JSON.stringify({score: environment.newScore})
        }).then((response) => {
            if (response.status === 201) {
                response.json().then((body) => {
                    bestness = body.bestness;
                    console.log("bestness: " + bestness);
                    if (bestness) {
                        environment.currentScoreRef.current.className = "number-area best";
                        environment.personalBestScoreRef.current.className = "score number new";
                        environment.personalBestScoreRef.current.innerHTML = environment.newScore;
                        environment.shareButtonRef.current.className = "share new-best";
                    }
                    if (bestness === 2) {
                        environment.overallBestScoreRef.current.className = "score number new";
                        environment.bestScoreSetterRef.current.className = "score-side-text new-setter";
                        setBestScore(environment, environment.newScore, myUsername);
                    }
                });
            }
            else if (response.status === 401) {
                console.log("Not logged in");
            }
        });
    }
    /*
    else {
        if (nullish(old_pers_best)) {
            environment.personalBestScoreRef.current.innerHTML = "";
        }
        else {
            environment.personalBestScoreRef.current.innerHTML = old_pers_best.score;
        }
    }*/
    /*

    let old_best = addScore("best_scores", environment.newScore);
    if (!nullish(environment.newScore) && (nullish(old_best) || environment.newScore < old_best.score)) {
        environment.overallBestScoreRef.current.className = "score number new";
        environment.bestScoreSetterRef.current.className = "score-side-text new-setter";
        setBestScore(environment, environment.newScore, myUsername);
    }
    else {
        if (nullish(old_best)) {
            environment.overallBestScoreRef.current.innerHTML = "";
        }
        else {
            setBestScore(environment, old_best.score, old_best.username);
        }
    }*/
}


export function updateHits(environment) {
    let old_pers_best = addScore(localStorage.getItem("username") + "_best_hits", environment.newHit, true);
    if (!nullish(environment.newHit) && (nullish(old_pers_best) || environment.newHit > old_pers_best.score)) {
        environment.personalBestHitRef.current.className = "hit number personal new";
        environment.personalBestHitRef.current.innerHTML = environment.newHit;
    }
    else {
        if (nullish(old_pers_best)) {
            environment.personalBestHitRef.current.innerHTML = "";
        }
        else {
            environment.personalBestHitRef.current.innerHTML = old_pers_best.score;
        }
    }

    let old_best = addScore("best_hits", environment.newHit, true);
    if (!nullish(environment.newHit) && (nullish(old_best) || environment.newHit > old_best.score)) {
        environment.overallBestHitRef.current.className = "hit number overall new";
        environment.bestHitSetterRef.current.className = "hit-side-text new-setter";
        setBestHit(environment, environment.newHit, localStorage.getItem("username"));
    }
    else {
        if (nullish(old_best)) {
            environment.overallBestHitRef.current.innerHTML = "";
        }
        else {
            setBestHit(environment, old_best.score, old_best.username);
        }
    }
}

export function resetVariables(environment) {
    environment.setAdv(false);
    environment.setScore(100000);
    environment.setSlashPresses(0);
    environment.currentScoreRef.current.className = "number-area";
    environment.personalBestScoreRef.current.className = "score number";
    environment.overallBestScoreRef.current.className = "score number";
    environment.bestScoreSetterRef.current.className = "score-side-text";
    environment.currentScoreRef.current.className = "number-area";
    environment.shareButtonRef.current.className = "share";

    environment.personalBestHitRef.current.className = "hit number personal";
    environment.overallBestHitRef.current.className = "hit number overall";
    environment.bestHitSetterRef.current.className = "hit-side-text";
}

import { nullish } from "../misc.jsx";

export function setBestScore(environment, score, setter) {
    environment.overallBestScoreRef.current.innerHTML = score;
    environment.bestScoreSetterRef.current.innerHTML = "Set by " + setter;
}

export function setBestHit(environment, hit, setter) {
    environment.overallBestHitRef.current.innerHTML = hit;
    environment.bestHitSetterRef.current.innerHTML = "Set by " + setter;
}

export function updateScores(environment, score, bestness) {
    let myUsername = localStorage.getItem("username");

        if (bestness) {
            environment.currentScoreRef.current.className = "number-area best";
            environment.personalBestScoreRef.current.className = "score number new";
            environment.personalBestScoreRef.current.innerHTML = score;
            environment.shareButtonRef.current.className = "share new-best";
        }
        if (bestness === 2) {
            environment.overallBestScoreRef.current.className = "score number new";
            environment.bestScoreSetterRef.current.className = "score-side-text new-setter";
            setBestScore(environment, score, myUsername);
        }
        environment.setNewScore(score);
}

export function updateHits(environment, hit, bestness) {
    let myUsername = localStorage.getItem("username");

    if (bestness) {
        environment.personalBestHitRef.current.className = "hit number personal new";
        environment.personalBestHitRef.current.innerHTML = hit;
    }
    if (bestness === 2) {
        environment.overallBestHitRef.current.className = "hit number overall new";
        environment.bestHitSetterRef.current.className = "hit-side-text new-setter";
        setBestHit(environment, hit, myUsername);
    }
    environment.setNewHit(hit);
}

export function updateBests(response, environment) {
    if (response.status === 200) {
        response.json().then((body) => {
            let best = body.overall_best;
            if (best) {
                setBestScore(environment, best.score, best.username);
            }
            if (body.pers_best !== undefined) {
                environment.personalBestScoreRef.current.innerHTML = body.pers_best;
            }

            let best_hit = body.overall_best_hit;
            if (best_hit) {
                setBestHit(environment, best_hit.score, best_hit.username);
            }
            if (body.pers_best_hit !== undefined) {
                environment.personalBestHitRef.current.innerHTML = body.pers_best_hit;
            }
        });
    }
    else if (response.status === 401) {
        environment.gameErrorMsgRef.current.innerHTML = "Error: Please log back in";
    }
    else {
        environment.gameErrorMsgRef.current.innerHTML = response.status + ": " + response.statusText;
    }
}

export function resetVariables(environment) {
    //environment.advance = false;
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


import {NavLink} from "react-router-dom";

export function getScores(record_name) {
    let record;
    let record_str = localStorage.getItem(record_name);
    
    if (!record_str) {
        record = [];
    }
    else {
        record = JSON.parse(record_str);
    }

    return record;
}

export function Navbar() {
    if (localStorage.getItem("username")) {
        return (
            <nav>
                <div className="main">
                    <NavLink className="navlink" to="/game">Game</NavLink>
                    <NavLink className="navlink" to="/scores">Scores</NavLink>
                </div>
                <NavLink className="navlink" to="/">Log out</NavLink>
            </nav>
        );
    }
    else {
        return (
            <nav>
                <NavLink className="navlink" to="/">Back to Login</NavLink>
            </nav>
        );
    }
}

export function nullish(val) {
    return (val === null || val === undefined);
}

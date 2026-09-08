import {NavLink} from "react-router-dom";

export function Navbar() {
    if (localStorage.getItem("username")) {
        return (
            <nav>
                <div className="main">
                    <NavLink className="navlink" to="/game">Game</NavLink>
                    <NavLink className="navlink" to="/scores">Scores</NavLink>
                    <NavLink className="navlink" to="/about">About</NavLink>
                </div>
                <p>Logged in as <span>{localStorage.getItem("username")}</span></p>
                <NavLink className="navlink" to="/">Log out</NavLink>
            </nav>
        );
    }
    else {
        return (
            <nav>
                <div className="main">
                    <NavLink className="navlink" to="/">Back to Login</NavLink>
                </div>
            </nav>
        );
    }
}

export function nullish(val) {
    return (val === null || val === undefined);
}

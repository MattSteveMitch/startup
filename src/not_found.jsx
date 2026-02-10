import React from "react";
import {NavLink} from "react-router-dom";

export function NotFound() {
    return (
        <div className="body">
            <div className="page-info">
                <link rel="icon" href="delver.png" />
                <title>Page not found</title>
            </div>
            <header>
                <h1>Page not found</h1>
                <nav>
                    <NavLink className="navlink" to="/">Home</NavLink>
                    <NavLink className="navlink" to="/game">Game</NavLink>
                    <NavLink className="navlink" to="/scores">Scores</NavLink>
                </nav>
            </header>

            <h2 style={{paddingTop: "50px", fontSize: "50px", paddingLeft: "10px"}}>
                Error 404: Not Found
            </h2>
        </div>
    );
}
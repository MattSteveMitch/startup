import React from "react";
import {Route, NavLink, BrowserRouter, Routes} from "react-router-dom";
import {Login} from "./login/login";
import {Game} from "./game/game";
import {Scores} from "./scores/scores";

//import "app.css" // If this doesn't work, use "./" at beginning of file path

export default function App() {
    return (

      <main>
         <h1>Log into Starsight</h1>
         <nav>
            <NavLink className="current" to="/">Log in</NavLink>
            <NavLink to="/game">Game</NavLink> // If this doesn't work, remove "/" at beginning of file path
            <NavLink to="/scores">Scores</NavLink>
         </nav>

         <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/game" element={<Game />} />
            <Route path="/scores" element={<Scores />} />
         </Routes>

      </main>
    );
}
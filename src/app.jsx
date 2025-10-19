import React from "react";
//import 'bootstrap/dist/css/bootstrap.min.css';
import {Route, NavLink, BrowserRouter, Routes} from "react-router-dom";
import {Login} from "./login/login";
import {Game} from "./game/game";
import {Scores} from "./scores/scores";

//import "app.css" // If this doesn't work, use "./" at beginning of file path


export default function App() {
    return (
      <main>
      <BrowserRouter>
         <nav>
            <NavLink className="navlink" id="current" to="/">Log in</NavLink>
            <NavLink className="navlink" to="game">Game</NavLink>
            <NavLink className="navlink" to="scores">Scores</NavLink>
         </nav>

         <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/game" element={<Game />} />
            <Route path="/scores" element={<Scores />} />
         </Routes>

      </BrowserRouter>
      </main>
    );
}
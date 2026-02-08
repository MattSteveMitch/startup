import React from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import {Home} from "/src/home/home";
import {Game} from "/src/game/game";
import {Scores} from "/src/scores/scores";
import "./app.css"


export default function App() {
    return (
        <div className="body">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />}></Route>
                    <Route path="/game" element={<Game />}></Route>
                    <Route path="/scores" element={<Scores />}></Route>
                </Routes>
            </BrowserRouter>
        </div>
    )
}

import React from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import {Login} from "/src/home/login";
import {Game} from "/src/game/game";
import {Scores} from "/src/scores/scores";
import {Register} from "/src/home/register";
import "./app.css"


export default function App() {
    return (
        <div className="body">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login />}></Route>
                    <Route path="/game" element={<Game />}></Route>
                    <Route path="/scores" element={<Scores />}></Route>
                    <Route path="/register" element={<Register />}></Route>
                </Routes>
            </BrowserRouter>
        </div>
    )
}

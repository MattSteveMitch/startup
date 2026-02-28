import React from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import {Login} from "/src/home/login";
import {Game} from "/src/game/game";
import {Scores} from "/src/scores/scores";
import {Register} from "/src/home/register";
import {Secret} from "/src/secret/secret";
import {NotFound} from "./not_found";
import "./app.css"


export default function App() {
    localStorage.setItem("shipType", "");
    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login />}></Route>
                    <Route path="/game" element={<Game />}></Route>
                    <Route path="/scores" element={<Scores />}></Route>
                    <Route path="/register" element={<Register />}></Route>
                    <Route path="/secret" element={<Secret />}></Route>
                    <Route path="*" element={<NotFound />}></Route>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

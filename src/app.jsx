import React from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import {Home} from "/src/home/home";
import {Game} from "/src/game/game";


export function App() {
    return (
        <div className="body">
            <BrowserRouter>
                <Routes>
                    <Route path="" element={<Home />}></Route>
                    <Route path="/game" element={<Game />}></Route>
                </Routes>
            </BrowserRouter>
        </div>
    )
}

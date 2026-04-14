import React from "react";
import {Navbar} from "./misc.jsx"

export function NotFound() {
    return (
        <div className="body">
            <div className="page-info">
                <link rel="icon" href="delver.png" />
                <title>Page not found</title>
            </div>
            <header>
                <h1>Page not found</h1>
                <Navbar />
            </header>

            <h2 style={{paddingTop: "50px", fontSize: "50px", paddingLeft: "10px"}}>
                Error 404: Not Found
            </h2>
        </div>
    );
}
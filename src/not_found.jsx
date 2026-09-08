import React from "react";
import {PageHeading} from "./misc.jsx"

export function NotFound() {
    return (
        <div className="body">
            <PageHeading title="Page Not Found" />

            <h2 style={{paddingTop: "50px", fontSize: "50px", paddingLeft: "10px"}}>
                Error 404: Not Found
            </h2>
        </div>
    );
}
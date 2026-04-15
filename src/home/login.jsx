import React from "react";
import { checkValidUsername, checkLoginPassword, submitLoginInfo, clearError, logOut } from "./home_aux.jsx";
import "./home.css";

var fields_login = [null, null];
const emptyLoginMsgs = ["Must enter username", "Must enter password"];


function setImgSize(image, maxDimension, aspectRatio) {
    if (aspectRatio > 1) {
        image.width = maxDimension;
        image.height = maxDimension / aspectRatio;
    }
    else {
        image.height = maxDimension;
        image.width = maxDimension * aspectRatio;
    }
}

export function Login() {
    var imgBoxRef = React.useRef(null);
    var aspectRatio, xkcd;


    React.useEffect(() => {
        function getMaxDimension() {
            return Math.min((window.innerHeight - 80) * aspectRatio, 450);
        }

        function resizeHandler(event) {
            let maxDimension = getMaxDimension();
            setImgSize(xkcd, maxDimension, aspectRatio);
        }

        xkcd = new Image();
        xkcd.src = "https://imgs.xkcd.com/comics/lightning.png" /*"https://imgs.xkcd.com/comics/woodpecker.png" "https://imgs.xkcd.com/comics/countdown_standard.png"*/;
        xkcd.onload = () => {
            aspectRatio = xkcd.width / xkcd.height;
            resizeHandler(null);
            if (imgBoxRef.current) {
                imgBoxRef.current.appendChild(xkcd);
            }
        }

        window.addEventListener("resize", resizeHandler);

        return () => {
            window.removeEventListener("resize", resizeHandler);
        }
    }, []);



    var LoginErrorMsgRef = React.useRef(null);
    var setInputPassword, setInputUsername;

    [fields_login[0], setInputUsername] = React.useState("");
    [fields_login[1], setInputPassword] = React.useState("");

    React.useEffect(() => {
        let storedUsername = localStorage.getItem("username");
        if (storedUsername) {
            logOut(LoginErrorMsgRef);
        }
    }, []);

    return (
        <div className="body home">
            <div className="page-info">
                <link rel="icon" href="delver.png" />
                <title>Log into Starsight</title>
            </div>
            <header>
                <h1>Log into Starsight</h1>
            </header>
            <main className="home">
                <div className="form">
                    <section>
                        <label htmlFor="username">Username:</label>
                        <input type="username" onBlur={(event) => { checkValidUsername(fields_login, emptyLoginMsgs, LoginErrorMsgRef); }}
                            onChange={(event) => { clearError(LoginErrorMsgRef); setInputUsername(event.target.value); }}>
                        </input>
                    </section>

                    <section>
                        <label htmlFor="password">Password:</label>
                        <input type="password" onBlur={(event) => { checkLoginPassword(fields_login, emptyLoginMsgs, LoginErrorMsgRef); }}
                            onChange={(event) => { clearError(LoginErrorMsgRef); setInputPassword(event.target.value); }} >
                        </input>
                    </section>

                    <button onClick={() => { submitLoginInfo(fields_login, emptyLoginMsgs, LoginErrorMsgRef); }}>Log in</button>
                    <button onClick={() => { document.location.href = "/register"; }}>Sign up</button>

                    <div className="errorMsg" ref={LoginErrorMsgRef}></div>
                </div>
                <div className="imgBox" ref={imgBoxRef}></div>
            </main>

            <footer>
                <p>View on</p>
                <p>
                    <a href="https://github.com/MattSteveMitch/startup">
                        <img src="github.png" alt="Github logo" width="70" />
                    </a>
                </p>
                <p id="author">Matthew Mitchell</p>
            </footer>
        </div>
    );
}

import {NavLink} from "react-router-dom";

function Navbar({isLoginPage}) {
    if (isLoginPage) {
        return (
            <nav>
                <NavLink className="navlink" to="/about">About</NavLink>
            </nav>
        );
    }
    else if (localStorage.getItem("username")) {
        return (
            <nav>
                <div className="main">
                    <NavLink className="navlink" to="/game">Game</NavLink>
                    <NavLink className="navlink" to="/scores">Scores</NavLink>
                    <NavLink className="navlink" to="/about">About</NavLink>
                </div>
                <p>Logged in as <span>{localStorage.getItem("username")}</span></p>
                <NavLink className="navlink" to="/">Log out</NavLink>
            </nav>
        );
    }
    else {
        return (
            <nav>
                <div className="main">
                    <NavLink className="navlink" to="/">Back to Login</NavLink>
                </div>
            </nav>
        );
    }
}

export function PageHeading({title, isLoginPage}) {
    return (
        <div>
            <div className="page-info">
                <link rel="icon" href="delver.png" />
                <title>{title}</title>
            </div>

            <header>
                <h1>{title}</h1>
                <Navbar isLoginPage={isLoginPage}/>
            </header>
        </div>
    );
}

export function GithubFooter() {
    return (
        <footer>
            <p>View on</p>
            <p>
                <a href="https://github.com/MattSteveMitch/startup">
                    <img src="github.png" alt="Github logo" width="40" />
                </a>
            </p>
            <p id="author">Matthew Mitchell</p>
        </footer>
    );
}

export function nullish(val) {
    return (val === null || val === undefined);
}

import React from "react";
//import 'bootstrap/dist/css/bootstrap.min.css';
import ReactDOM from "react-dom/client";
import "./login.css";

function LoginHeading() {
    return <h1>Log into Starsight</h1>;
}

function LoginBody() {
    return (
        <div className="loginBody">

<main>
   <div>
      <form action="game.html">
         <section>
            <label htmlFor="username">Username:</label>
            <input type="username">
            </input>
         </section>

         <section>
            <label htmlFor="password">Password:</label>
            <input type="password">
            </input>
         </section>

         <button type="submit">Log in</button>
         <a href="register.html">
            <button type="button">Create account</button>
         </a>

         <footer>
            <p>View on</p>
            <a href="https://github.com/MattSteveMitch/startup">
               <img src="images/github.png" alt="Github logo" width={70}></img>
            </a>
         </footer>
      </form>
   </div>
</main>

</div>
    );
}

export function Login() {
    const loginHeadingRoot = ReactDOM.createRoot(document.getElementById("heading"));
    loginHeadingRoot.render(<LoginHeading />);
    const loginBodyRoot = ReactDOM.createRoot(document.getElementById("body"));
    loginBodyRoot.render(<LoginBody />);
}
import React from "react";
//import 'bootstrap/dist/css/bootstrap.min.css';
import {Route, NavLink, BrowserRouter, Routes} from "react-router-dom";
import {Login} from "./login/login";
import {Game} from "./game/game";
import {Scores} from "./scores/scores";
import "./app.css";

function NotFound() {
   return (
   <h2 style={{paddingTop: 50, fontSize: 50, paddingLeft: 10}}>
      Error 404: Not Found
   </h2>
   );
}

function MyNav(args) { /* Yes, the entire reason why I created this function was to keep track of which page
   the user is currently on. Yes, I realize now, after writing all this out, that NavLinks already do that
   under the hood anyway using the `className="active"` concept. As a result, am I going to delete this 
   unnecessary feature that I created? Absolutely not. I worked LONG and hard on this, and I feel like I 
   learned a lot in the process, so I'm keeping the fruits of my labors, gosh dang it!!!! Even if they're 
   pointless!! */
   console.log(args.pageNames);
   let isCurr = ["", "", ""];

   for (let i = 0; i < args.pageNames.length; i++) {
      if (args.currPage.localeCompare(args.pageNames[i])) {
         isCurr[i] = "";
      }
      else {
         isCurr[i] = "curr";
      }
   }

   return (
      <nav className="myNav">
         <NavLink id="login" className={isCurr[0] + " navlink"} to="/">Log in</NavLink>
         <NavLink id="game" className={isCurr[1] + " navlink"} to="game">Game</NavLink>
         <NavLink id="scores" className={isCurr[2] + " navlink"} to="scores">Scores</NavLink>
      </nav>
   );
}

export default function App() {
    const [currentPage, switchPage] = React.useState("login");
    const pages = ["login", "game", "scores"];


    console.log(typeof(switchPage));
    return (
      <main className="nav">
      <BrowserRouter>
         <MyNav currPage={currentPage} pageNames={pages}/>

         <Routes>
            <Route path="/" element={<Login switchFun={switchPage} />} />
            <Route path="/game" element={<Game switchFun={switchPage} />} />
            <Route path="/scores" element={<Scores switchFun={switchPage} />} />
            <Route path="*" element={<NotFound />}/>
         </Routes>
      </BrowserRouter>
      <p style={{height: 3}}></p>
      </main>
    );
}

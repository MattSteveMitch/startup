import React from "react";
import ReactDOM from "react-dom/client";
import "./scores.css";

function ScoresHeading() {
    return <h1>Best Scores</h1>;
}

function ScoresBody() {
        return (
        <div className="scoresBody">

<main>
    <section>
        <h2>Least deaths to complete the game</h2>
        <table className="score">
            <th className="rank">Rank</th>
            <th className="player">Player</th>
            <th>Score</th>
            <tr className="spare">
                <td></td>
                <td></td>
                <td>(number of deaths)</td>
            </tr>
            <tr>
                <td>1</td>
                <td>AnonymousCloud6312</td>
                <td>12</td>
            </tr>
            <tr>
                <td>2</td>
                <td>ElegyMan</td>
                <td>13</td>
            </tr>
            <tr>
                <td>3</td>
                <td>AnonymousCloud6312</td>
                <td>21</td>
            </tr>
            <tr>
                <td>4</td>
                <td>Bro</td>
                <td>22</td>
            </tr>
            <tr>
                <td>5</td>
                <td>Grond2</td>
                <td>22</td>
            </tr>
            <tr>
                <td>6</td>
                <td>Grond</td>
                <td>22</td>
            </tr>
            <tr>
                <td>7</td>
                <td>Based4892</td>
                <td>26</td>
            </tr>
            <tr>
                <td>8</td>
                <td>Nolendil</td>
                <td>30</td>
            </tr>
            <tr>
                <td>9</td>
                <td>Swordsman12</td>
                <td>35</td>
            </tr>
            <tr>
                <td>10</td>
                <td>Nolendil</td>
                <td>41</td>
            </tr>
        </table>
    </section>

    <section>
        <h2>Most damaging hits to Krell ship</h2>
        <table>
            <th className="rank">Rank</th>
            <th className="player">Player</th>
            <th>Damage dealt</th>
            <tr className="spare">
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td>1</td>
                <td>ElegyMan</td>
                <td>179.2</td>
            </tr>
            <tr>
                <td>2</td>
                <td>ElegyMan</td>
                <td>161.6</td>
            </tr>
            <tr>
                <td>3</td>
                <td>AnonymousCl</td>
                <td>121.0</td>
            </tr>
            <tr>
                <td>4</td>
                <td>Bro</td>
                <td>110.1</td>
            </tr>
            <tr>
                <td>5</td>
                <td>Grond2</td>
                <td>100.1</td>
            </tr>
            <tr>
                <td>6</td>
                <td>Grond</td>
                <td>79.4</td>
            </tr>
            <tr>
                <td>7</td>
                <td>Based4892</td>
                <td>79.3</td>
            </tr>
            <tr>
                <td>8</td>
                <td>Nolendil</td>
                <td>75.0</td>
            </tr>
            <tr>
                <td>9</td>
                <td>Swordsman12</td>
                <td>70.1</td>
            </tr>
            <tr>
                <td>10</td>
                <td>Nolendil</td>
                <td>68.1</td>
            </tr>
        </table>
    </section>

    <section>
        <h2>Personal best scores</h2>
        <table className="score">
            <th></th>
            <th>Score</th>
            <tr className="spare">
                <td></td>
                <td>(number of deaths)</td>
            </tr>
            <tr>
                <td>1</td>
                <td>12</td>
            </tr>
            <tr>
                <td>2</td>
                <td>13</td>
            </tr>
            <tr>
                <td>3</td>
                <td>21</td>
            </tr>
            <tr>
                <td>4</td>
                <td>22</td>
            </tr>
            <tr>
                <td>5</td>
                <td>22</td>
            </tr>
            <tr>
                <td>6</td>
                <td>22</td>
            </tr>
            <tr>
                <td>7</td>
                <td>26</td>
            </tr>
            <tr>
                <td>8</td>
                <td>30</td>
            </tr>
            <tr>
                <td>9</td>
                <td>35</td>
            </tr>
            <tr>
                <td>10</td>
                <td>41</td>
            </tr>
        </table>
    </section>

    <section>
        <h2>Personal best hits</h2>
        <table>
            <th></th>
            <th>Damage dealt</th>
            <tr className="spare">
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td>1</td>
                <td>179.2</td>
            </tr>
            <tr>
                <td>2</td>
                <td>161.6</td>
            </tr>
            <tr>
                <td>3</td>
                <td>121.0</td>
            </tr>
            <tr>
                <td>4</td>
                <td>110.1</td>
            </tr>
            <tr>
                <td>5</td>
                <td>100.1</td>
            </tr>
            <tr>
                <td>6</td>
                <td>79.4</td>
            </tr>
            <tr>
                <td>7</td>
                <td>79.3</td>
            </tr>
            <tr>
                <td>8</td>
                <td>75.0</td>
            </tr>
            <tr>
                <td>9</td>
                <td>70.1</td>
            </tr>
            <tr>
                <td>10</td>
                <td>68.1</td>
            </tr>
        </table>
    </section>

</main>

</div>
    );
}

export function Scores() {
    const scoresHeadingRoot = ReactDOM.createRoot(document.getElementById("heading"));
    scoresHeadingRoot.render(<ScoresHeading />);
    const scoresBodyRoot = ReactDOM.createRoot(document.getElementById("body"));
    scoresBodyRoot.render(<ScoresBody />);
}
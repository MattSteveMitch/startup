import {PageHeading} from "../misc.jsx";
import "./about.css";

export function About() {
    return (
        <div className="body">
            <PageHeading title="About Starsight"/>

            <main className="about">
                <div className="text">
                    <section>
                        <h2>The Book</h2>
                        <p>Starsight is the second book in the Skyward series by Brandon Sanderson, and is the inspiration for
                            this web game. The series follows a teenager, Spensa Nightshade, as she sets out to save the remnant
                            of the human race, which is stranded on a hostile planet under constant attack by a mysterious alien
                            empire called the Superiority. Along the way, she learns about an even greater threat: a race of omnicidal
                            beings with god-like powers, called delvers, which inhabit an extradimensional space called the
                            nowhere. These beings sometimes appear to her in vision as countless glowing, malevolent eyes
                            peering out of the void of space like stars. Should a delver ever enter the physical world, it will
                            amass a vast cloud of space debris around itself and hurl it at nearby inhabited areas such as space
                            stations, ships, and planets.</p>
                        <p>It is in that setting that this space adventure game takes place!</p>
                    </section>
                    <section>
                        <h2>The Game</h2>
                        <p>This game is a 2D space shooter game where you use your light-lance and destructors to take down an enemy ship. Log in or create an account to play!</p>
                    </section>
                    <section className="glossary">
                        <h2>Glossary of terms</h2>
                        <div className="glossary-text">
                            <h3>DDF</h3>
                            <p>Defiant Defense Force: The military force of humans fighting for the survival of their species</p>
                            <h3>delver</h3>
                            <p>Omnicidal, god-like being dwelling in the nowhere</p>
                            <h3>destructors</h3>
                            <p>Destructive energy bolts fired by fighter ships</p>
                            <h3>ember</h3>
                            <p>Piece of space debris hurled by a delver in the physical world</p>
                            <h3>Krell</h3>
                            <p>Superiority fighter used against humans; in the game, this term refers to the battleship you are fighting against.</p>
                            <h3>light-lance</h3>
                            <p>Energy beam which acts as a rope, connecting a ship to whatever object the beam hits; all human fighters are equipped with a light-lance.</p>
                            <h3>M-Bot</h3>
                            <p>Spensa's highly advanced starfighter and A.I. sidekick; M-Bot's controls are highly sensitive compared to a Poco, as you may discover in the game.</p>
                            <h3>nowhere</h3>
                            <p>Extradimensional space inhabited by the delvers</p>
                            <h3>Poco</h3>
                            <p>Standard-issue DDF starfighter model</p>
                            <h3>Superiority</h3>
                            <p>The corrupt alien empire repressing the human race</p>
                        </div>
                    </section>
                    <section className="credits">
                        <h2>Credits</h2>
                        <p>
                            <span>M-Bot image: </span>
                            <a href="https://www.reddit.com/r/Skyward/comments/aa4b1m/mbot_starship/">u/MrCorella</a> on Reddit
                        </p>
                        <p>
                            <span>Poco image: </span>
                            <a href="https://www.reddit.com/r/brandonsanderson/comments/a1i6hq/skyward_ddf_poco_ship_model/">u/wiserebel</a> on Reddit
                        </p>
                        <p>
                            <span>Explosion image: </span>
                            <a href="https://www.freeiconspng.com/img/45945">https://www.freeiconspng.com/img/45945</a>
                        </p>
                        <p>
                            <span>Asteroid image: </span>
                            <a href="https://en.wikipedia.org/wiki/File:Missouri_round_rock.jpg">https://en.wikipedia.org/wiki/File:Missouri_round_rock.jpg</a>
                        </p>
                        <p>
                            <span>Rush E: </span>
                            <a href="https://www.youtube.com/watch?v=Qskm9MTz2V4">Sheet Music Boss</a> on YouTube; sequenced by&#32;
                            <a href="https://onlinesequencer.net/5474103">raurirauri</a> on onlinesequencer.net
                        </p>
                    </section>
                </div>
                <img src="../../bookcover.png" alt="Starsight book cover" height={450} />
            </main>
        </div>
    );
}

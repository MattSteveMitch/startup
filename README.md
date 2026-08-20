# Starsight

[My Notes](notes.md)

### Elevator pitch

For anyone who's read and enjoyed the [Skyward series](https://www.brandonsanderson.com/pages/skyward-series), or just likes simple 2D space action games à la [Asteroids](https://en.wikipedia.org/wiki/Asteroids_(video_game)), this is for you! Take down evil Commander Winzik's ship by using your light-lance to grapple rocks thrown by the [Delver](https://coppermind.net/wiki/Delver) and sling them at the battleship. The plan is to make a website will all the basic functionality necessary to one day implement the full game online (originally written by me as an offline game in Python; source code [here](https://github.com/MattSteveMitch/Starsight)).

None of this code is AI-generated.

### Design

View it at <https://startup.starsight.click>

### Key features

- Account creation page
- Login page
- Starsight game UI
- Scores sidebar:
    - Most recent score
    - Personal best score
    - Overall best score (updates using websocket)
    - Personal best hit to enemy spaceship
    - Overall best hit to enemy spaceship
- Page for top 10 of each kind of score (Personal best, Overall best, Personal best hit, Overall best hit)

### Technologies

I am going to use the required technologies in the following ways.

- **HTML** - Set up webpage with main game screen, title, and scores to the left of the game screen, as well as scores page with table of top 10 personal and overall bests, and login page
- **CSS** - Stylize text, display little animation on game page whenever the most recent score, personal best, or overall best score updates, make scores page look cool and not boring, format XKCD comic on login page
- **React** - Handle transitions between homepage, game UI, and account creation screen. Also handle registering of interactions with game, and animation
- **Service** - To log in, log out, create account, update scores, fetch updated scores, and fetch a random XKCD comic on the login page
- **DB/Login** - Store authentication tokens, accounts, most recent scores, and high scores
- **WebSocket** - Game itself will depend on a websocket connection to the server to prevent cheating; client will send player input events to the server, which will process them and send back data indicating how to draw the next animation frame. I've got the browser to register all the input events that I'll need to play the game, and it responds to most of them (including mouse movement, clicks, scroll wheel movement, pressing slash or spacebar) but at this point the game is very boring. Press the right arrow key to start, restart, or finish the game. The "hit" aspect is represented by how many times you press the slash key in a game. The scores page accurately reflects whatever "scores" and "hits" were achieved by various players.

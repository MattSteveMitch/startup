# Starsight

[My Notes](notes.md)

## 🚀 Specification Deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [x] Proper use of Markdown
- [x] A concise and compelling elevator pitch
- [x] Description of key features
- [x] Description of how you will use each technology
- [x] One or more rough sketches of your application. Images must be embedded in this file using Markdown image references.

### Elevator pitch

For anyone who's read and enjoyed the [Skyward series](https://www.brandonsanderson.com/pages/skyward-series), or just likes simple 2D space action games à la [Asteroids](https://en.wikipedia.org/wiki/Asteroids_(video_game)), this is for you! Take down evil Commander Winzik's ship by using your light-lance to grapple rocks thrown by the [Delver](https://coppermind.net/wiki/Delver) and sling them at the battleship.

### Design

![Design image](page.png)

### Key features

- Account creation page
- Login page
- Starsigt game UI
- Scores:
    - Most recent score
    - Personal best score
    - Overall best score (updates using websocket)
    - Personal best hit to enemy spaceship
    - Overall best hit to enemy spaceship
- Page for top 10 of each kind of score (Personal best, Overall best, Personal best hit, Overall best hit)

### Technologies

I am going to use the required technologies in the following ways.

- **HTML** - Set up webpage with main game screen, title up top, and scores to the left of the game screen
- **CSS** - Stylize text, create gradient in background of game page, display little animation whenever the most recent score, personal best, or overall best score updates
- **React** - Handle transitions between homepage, game UI, and account creation screen
- **Service** - To start game, log in, log out, create account, and share score on Facebook or Twitter
- **DB/Login** - Store authentication tokens, accounts, most recent scores, and high scores
- **WebSocket** - Handle interaction between player and game UI, as well as updates when someone sets a new overall high score

## 🚀 AWS deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [x] **Server deployed and accessible with custom domain name** - [My server link](https://starsight.click).

## 🚀 HTML deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [x] **HTML pages** - Scores page, game page, login page, and account creation page.
- [x] **Proper HTML element usage** - Body, div, headers, sections, footer, etc.
- [x] **Links** - To Facebook, Twitter, this repo, navigation between pages
- [x] **Text** - Scores on scores page and game page
- [x] **3rd party API placeholder** - Buttons to share score on Facebook, Twitter
- [x] **Images** - Logos for FB, Twitter, that link to their respective home pages, Github logo linking to this repo, placeholder for game window
- [x] **Login placeholder** - I did not complete this part of the deliverable.
- [x] **DB data placeholder** - High scores on scores page
- [x] **WebSocket placeholder** - Image for game window

## 🚀 CSS deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [x] **Header, footer, and main content body** - These are present in the website
- [x] **Navigation elements** - You can navigate between pages
- [x] **Responsive to window resizing** - Score summary only appears if there's room; game window is centered in remaining space
- [x] **Application elements** - Many types of elements
- [x] **Application text content** - Scores and such
- [x] **Application images** - Logos for FB, Twitter, that link to their respective home pages, Github logo linking to this repo, placeholder for game window

## 🚀 React part 1: Routing deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] **Bundled using Vite** - I did not complete this part of the deliverable.
- [ ] **Components** - I did not complete this part of the deliverable.
- [ ] **Router** - I did not complete this part of the deliverable.

## 🚀 React part 2: Reactivity deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] **All functionality implemented or mocked out** - I did not complete this part of the deliverable.
- [ ] **Hooks** - I did not complete this part of the deliverable.

## 🚀 Service deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] **Node.js/Express HTTP service** - I did not complete this part of the deliverable.
- [ ] **Static middleware for frontend** - I did not complete this part of the deliverable.
- [ ] **Calls to third party endpoints** - I did not complete this part of the deliverable.
- [ ] **Backend service endpoints** - I did not complete this part of the deliverable.
- [ ] **Frontend calls service endpoints** - I did not complete this part of the deliverable.
- [ ] **Supports registration, login, logout, and restricted endpoint** - I did not complete this part of the deliverable.


## 🚀 DB deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] **Stores data in MongoDB** - I did not complete this part of the deliverable.
- [ ] **Stores credentials in MongoDB** - I did not complete this part of the deliverable.

## 🚀 WebSocket deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] **Backend listens for WebSocket connection** - I did not complete this part of the deliverable.
- [ ] **Frontend makes WebSocket connection** - I did not complete this part of the deliverable.
- [ ] **Data sent over WebSocket connection** - I did not complete this part of the deliverable.
- [ ] **WebSocket data displayed** - I did not complete this part of the deliverable.
- [ ] **Application is fully functional** - I did not complete this part of the deliverable.

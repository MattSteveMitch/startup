1. `git pull`
2. modify files and stuff
3. `git add [modified file]`
4. `git commit -m [message in ""]`
5. `git push`


`ssh -i "Starsight access.pem" ubuntu@18.205.75.196`
terminate elastic IP address when not needed

development environment: IDE, github, any space where you work on code

production environment: the server, where stuff goes when it's finished

use shell script to push from dev. environ. to prod. environ. when ready to update

Document object model: tree structure holding data in webpage

Caddy: gets web certificate, handles https, directs traffic from main port to specialized port


CSS: Cascading style sheets

p {
    color: green;
}

p is selector (select all paragraphs), "color: green" is rule (make them green)


Ways to insert CSS into html:
1. A style sheet
<head>
<link rel="stylesheet" href="styles.css" />
</head>

2. `style` attribute in html:
`<p style="color:green">Text here!</p>`

3. add <style> ELEMENT to <head> element in html
<head>
  <style>
    p {
      color: green;
    }
  </style>
</head>
<body>
  <p>CSS</p>
</body>


Responsive styles:

`<meta`
`  name="viewport"`
`  content="width=device-width, initial-scale=1"`
`/>`
Means do not auto-adjust html for phone screen because programmer has already taken mobile devices into account

aside {
    float: right; 
}
`float: right` means align against right edge


grid


flex:

.container {
    display: flex;
    flex-direction: column
}
meaning make children flexible in the vertical direction

.item {
    flex: 0 0 50px;
}
meaning don't grow, don't shrink, start out at 50px

.item1 {
    flex: 1 0 50px;
}

.item2 {
    flex: 2 0 50px;
} 
meaning let item2 flex twice as much as item1 if window size changes
(.item is a placeholder in this case for a sub-element; .container is placeholder for super-element)
50px means give both elements a maximum size of 50 pixels in the flex direction

@media ((orientation: portrait)) { // If orientation is portrait, then do the following
    body {
        flex-direction: column;
    }
}

@media ((orientation: portrait) and (max-height: 500px)) { // If orientation is portrait and height is less than 500px, then do the following
    body {
        display: none;
    } /* Body vanishes */
}


<head>
  <link rel="stylesheet" href="link-to-bootstrap-stylesheet"\>
</head>
Bootstrap is very popular starting point for style sheets


To turn an image into a link, wrap <img></img> in an anchor tag


JavaScript:

interpreted
dynamically typed
declare variable using `let myStr = "hello world";`
OR
`const c = "hi";`
`let arr = ["hi", 123.3];`
`const words = ['hello', 'world'];`
`words.forEach((word) => console.log(word));`
function fun() {
    let i = 0;
    i++;
    while (i < 5) {
        console.log('hello');
    }
}
In browser, console is hidden in developer tools

How to embed in website?
Within <head> element, insert <script src='index.js'></script>
<button onclick="[JS code goes here]"></button>

<span> means select a piece of text within one element
<p>Hello, <span style="color: blue;">this</span> is text!</p>

p.foo means a paragraph with class="foo"
.foo > p means an child of an element of class="foo"
section > p means a child of a section that is a paragraph

computer > signal to router
looks up domain name to find IP address
routes signal to server, port 443
Caddy receives signal, reroutes signal to correct gate for subdomain if applicable
if no subdomain, Caddy sends index.html
else, another entity serves up whatever is requested; if nothing particular requested, sends the particular index.html for that port

index.html references other files needed to build webpage (CSS, JS/React, etc.)

Vite "compiles"/transpiles the files together into two complete files
Like compiled code, this new code is optimized, abstract, hard to read

JS:

function doMath(operation, a, b) {
  return operation(a,b);
}

console.log(doMath(function (a, b) {return a - b; }, 5, 3));
console.log(doMath((a, b) => a-b, 5, 3));
// These latter two statements are equivalent; they pass in an anonymous (or lambda) 
// function to `doMath` and operands 5 and 3

Arrow function definitions (equivalent):
() => 3;
() => { return 3; };


() => { 3; }; // This is not the same as the other two; it executes the statement `3`, 
// which returns nothing

function makeClosure(init) {
  let closureval=init;
  return () => `closure ${++closureval}`;
}

const a = [1, 2, 3];
console.log(a.map((i) => i + 1));
console.log(a.reduce((v1, v2) => v1 + v2));
console.log(a.sort((v1, v2) => v2 - v1)); // Passing in comparison function; negatives
// and 0 evaluate to false, positives to true

JS object (like a JSON): 

const obj = {
  num: 3,
  name: "Josh",
  numbers: [1, 2, 3],
  subobj: {e: false}
}

JS class (different from object!):

class Person {
  constructor(name) {
    this.name = name;
  }
}

class Employee extends Person {
  constructor(name) {
    super(name);
  }
}

const i = [1, 2, 3, 4];
const [t, s] = i; // same as t=1; s=2;
const [m, , , n] = i; // m=1; n=4;
// this is called destructuring

const o = {a: 1, b: 'animals', c: ['fish', 'cats']};

const root = ReactDOM.
const [var, updateVar] = React.useState(10); // Returns the number 10 and a function
// to update var

function UseEffectDemo() {
  React.useEffect(  () => {console.log("rendered");}  );

  return <div>Something!</div>
}

A React.useEffect is a thing that sets a function to be called every time an element is re-rendered
Only at top level of function!

React.useEffect(  () => {console.log("rendered");} [memberVar,  memberVar2] ); 
// I think this means only call function when memberVar or memberVar2 are updated


`<Element />` calls `function Element()`
`<Element member1={biscuit} member2={biscuit} + 10 />` calls `function Element(args)`
args.member1 will then be the value of biscuit (`{}` is like a dereference operator)

let x = 10; // Sets x equal to 10; if it is changed locally, it will resume its initial value when you go out of scope

Promise: object that acts as a placeholder for pending data with a function to get the data. When created, the Promise calls the function

const userName = new Promise(getSomeData);

userName
    .then((receivedUserName) => {console.log(receivedUserName);}) // On success
    .catch((receivedUsername => {console.log("Error!");})) // On failure
    .finally((receivedUsername) => {console.log("Done");}) // After .catch or .then


HTTp request
GET POST PUT DELETE


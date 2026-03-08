1. `git pull`
2. modify files and stuff
3. `git add [modified file]`
4. `git commit -m [message in ""]`
5. `git push`


`git branch new_branch` make new branch
"sacred timeline" branch is called "master"
`git checkout other_branch` to switch to new branch
`git merge other_branch` to merge current branch with other
`git restore .` discard changes back to most recent commit
`git reset --soft [hash of some commit]` delete all commits after the given one, but don't change files to match that commit
`git reset --hard [hash of some commit]` delete all commits after the given one, and revert current files to match that commit
`git fetch` + `git status` tells you how your local copy differs from main repo

Tim Berners-Lee: Used existing concept of hypertext, created html
Hakon Wium Lie: "Tim, your page is ugly." solution: CSS!
Brendan Eich: JavaScript: direct interaction with webpage, instead of filling out form and sending to the server, which runs cgi program

Send request to DNS server for IP address of the domain name, then go to that IP address

TLD: top-level domain (.edu, .com, .org, .info, .me)

SLD: second-level domain (coolmathgames, byu)

A record: gives IP address directly
CNAME: points to an A record (enter subdomain or alias (byu.com, lds.org), it points you to the canonical name)


`ssh -i "Starsight access.pem" ubuntu@18.205.75.196`
terminate elastic IP address when not needed

development environment: IDE, github, any space where you work on code

production environment: the server, where stuff goes when it's finished

use shell script to push from dev. environ. to prod. environ. when ready to update

Document object model: tree structure holding data in webpage

Caddy: gets web certificate, handles https, directs traffic from main port to specialized port


<a></a> anchor
href: hyperlink reference
head: not rendered, just metadata


CSS: Cascading style sheets

p {
    color: green;
}

`font-size: 3em;` means make it 3 times its normal size
`font-size: 10vh` means 10% of view heigt

p is selector (select all paragraphs), "color: green" is rule (make them green)

<meta> name="viewport" content="width=device-width, initial-scale=1"</meta>

`float: right;`  Makes it stick to the right side of the screen

display types:
block: fills width of parent container
inline: does not resize to fill
flex: change position of children based on available space

minmax: 100px, 1fr
1fr means 1 fractional unit


Ways to insert CSS into html:
1. A style sheet
<head>
<link rel="stylesheet" href="styles.css" />
</head>

2. `style` attribute in html:
`<p style="color:green; font-size:20px">Text here!</p>`

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

#r means select where id="r"
.r means select where class="r"

special electors:
list: `body, section` body or section
descendent: `body section` section that's descendant of body
child: `body > section` section that's direct child of body
pseudo: `p:hover` paragraph when the cursor hovers over it

content, padding, border, margin

class="class1 class2";


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
meaning make CHILDREN flexible in the vertical direction

flex-direction: column-reverse
means reverse elements
display: grid;  means populate left to right, then wrap to next row (I think)

.item {
    flex: 0 0 50px; 
}
meaning don't grow, don't shrink, start out at 50px
grow, shrink, basis: if leftover room, grow by this much (fractional units); if not enough room, shrink by this much

flex: 0 0 20%;


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
Tailwind is also popular

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
`setInterval(function, milliseconds)` calls a function every `milliseconds` milliseconds
`console.log("Hello world")` prints to console
`document.body.innerHTML = <h1>cow</h1>`
`document.body.innerText = "cow"`
`document.body.querySelector('#id')` selects elements by id
`document.body.querySelector('.class')` selects elements by class

function fun() {
    let i = 0;
    i++;
    while (i < 5) {
        console.log('hello');
    }
}
In browser, console is hidden in developer tools

JSX: integrates HTML into javascript

`const x = <p id="2" cow="moo">text {1+1}</p>` JSX
becomes
`const x = React.createElement("p", {id: '2', cow: "moo"}, "text", 1+1);` pure JavaScript
creates
`<p id="2" cow="moo">text 2</p>` HTML

`const root = ReactDOM.createRoot(document.querySelector('#root'));`
selects an element with the id of 'root'
`root.render(<Function />);` replaces the inside of the id=root element:
`<div id='root'>Loading...</div>` becomes `<div id='root'>This is the root element!</div>`

`const Hello = ({phrase, phrase2}) => {return <div>Hello {phrase} {phrase2}</div>}` Hello extracts the `phrase` and `phrase2` properties of the parameter




How to embed in website?
Within <head> element, insert <script src='index.js'></script>
<button onclick="[JS code goes here]"></button>

<span> means select a piece of text within one element
<p>Hello, <span style="color: blue;">this</span> is text!</p>

Node.js allows you to run javascript outside of browser
`node [js program]` runs program on command line
`node` opens js shell


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

Vite "compiles"/transpiles the files from jsx to javascript and html
builds things together into two complete files

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

`const [b, c, ...others] = a;` means assign b to the first element of a, c to the second, and others to the rest of the list


`const o = {a: 1, b: 'animals', c: ['fish', 'cats']};`
`const {a, c} = o;` Means extract the `a` and `c` attributes of the object, naming them as such.
`const {a: count, b: type} = o;` Means extract the `a` and `b` attributes of the object, renaming them as `count` and `type`. Default values can be given, e.g. `const {a, b, d="I don't know"} = o;`

const root = ReactDOM.
const [var, updateVar] = React.useState(10); // Returns the number 10 and a setter function that you
// can call to update var
This lets var persist outside of the function's scope

to update the value, updateVar can be given a value, or a function:
`updateVar((varVal) => varVal + 1;)` is thread safe
`updateVar(var + 1;)` is not thread safe


`function App() {`
`  const [count, setCount] = React.useState(0);`

`  return (`
`    <div>`
`      <h1>Count: {count}</h1>`
`      <button onClick={() => setCount((prevCount) => prevCount + 1)}>n++</button>`
`      <button onClick={() => setCount((prevCount) => prevCount - 1)}>n--</button>`
`    </div>`
`  );`
`}`
Thread safe!



function App() {
  const [count, setCount] = React.useState(0);

  function counterOpFactory(op) {
    return () => setCount((prevCount) => op(prevCount));
  }

  const incOp = counterOpFactory((c) => c + 1);
  const decOp = counterOpFactory((c) => c - 1);
  const tenXOp = counterOpFactory((c) => c * 10);

  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={incOp}>n++</button>
      <button onClick={decOp}>n--</button>
      <button onClick={tenXOp}>n*10</button>
    </div>
  );
}
Less messy, uses a closure, also thread safe

onChange = {onChange}
event.target.value



JS Objects are like maps where the value can be of any type, even different types within the same map (Object)

Any function that returns an object is considered a constructor and can be invoked with the `new` operator.

`function Person(name) {`
`  return {`
`    log: function () {`
`      console.log('My name is ' + this.name);`
`    },`
`    name: name,`
`  };`
`}`

`const p = new Person('Eich');`
`p.log()` My name is Eich

However, in order to use inheritance, you need to use the `class` functionality

`setTimeout(() => console.log('time is up'), 2000);` Means "execute this later, after this amount of time, but in the meantime continue executing code"
`setInterval` works the same way, except it keeps executing the code every _____ milliseconds

JSON.stringify: JS Object to JSON
JSON.parse: JSON to JS object


localStorage is a global Object stored on the client's side (their browser) that can be manipulated with removeItem(name), getItem(name), setItem(name, value), and clear()



function UseEffectDemo() {
  React.useEffect(  () => {console.log("rendered");}  );

  return <div>Something!</div>
}


`console.log('hello %s', 'world');`
`console.log('hello %c world', 'color: green;');` formats everything after `%c`
`console.time('timerName')` creates and starts a timer
`console.time('timerName')` stops that timer
`console.count('countName')` count how many times this specific counter has been invoked

default parameters exist in JS

arrow function: `(x, y) => x + y;`, `(x, y) => {x++; y++; return x + y;}`
arrow function inherits the entire environment in which it was declared; any variable that it can reference persists after it "should" be forgotten
this is called a closure



`<BrowserRouter>` (my understanding):

`<BrowserRouter>`: component that wraps the `<Routes>` component and creates the components specified by `<Routes>` as its own children. When `<Routes>` gives it a new component to render, it removes the previous component that it created
`<Routes>` component should be a child of the BrowserRouter; it retrieves different components depending on the current path specified in the URL, gives them to the parent `<BrowserRouter>`
`<NavLinks>` should be descendants of BrowserRouter; they change the current path in the URL


A React.useEffect is a thing that sets a function to be called every time an element is re-rendered
Only at top level of function!

`React.useEffect(  () => {console.log("rendered");} [memberVar,  memberVar2] ); `
// I think this means only call function when memberVar or memberVar2 are updated
`React.useEffect(  () => {console.log("rendered");} [] ); ` means only call when component is first rendered
If the function that you pass to useEffect returns a function, that's called a cleanup function, it means that that function is called when the component is destroyed rather than rerendered.

`<Element />` calls `function Element()`
`<Element member1={biscuit} member2={biscuit} + 10 />` calls `function Element(args)`
args.member1 will then be set to the value of biscuit (`{}` is like a dereference operator)

let x = 10; // Sets x equal to 10; if it is changed locally, it will resume its initial value when you go out of scope


Promise: object that acts as a placeholder for pending data with a function to get the data. When created, the Promise calls the function
can be used for an efficient fibonacci calculator

promise states: pending, fulfilled, or rejected


Browser rendering is single-threaded! Make everything asynchronous as much as you can


`function callback(resolve) {`
`  resolve('done');`
`}`

`const p = new Promise(callback);`
`p.then((result) => console.log(result)); ` Outputs "done"



let p = new Promise((resolve, reject) => {
  if (Math.random > 0.5) {
    resolve("Success!");
  }
  else {
    reject("Failure!");
  }
});


const userName = new Promise(getSomeData);

userName
    .then((receivedUserName) => {console.log(receivedUserName);}) // On success
    .catch((receivedUsername => {console.log("Error!");})) // On failure
    .finally((receivedUsername) => {console.log("Done");}) // After .catch or .then

fetch() function:
creates a Promise internally
`fetch(URL).then((resource) => console.log(resource));`
`x = fetch(URL).then((resource) => console.log(resource));` sets x equal to the Promise, then moves on

Promises can be chained: promise1(...).then().then()
fetch(url).then(r => r.json).then(j => console.log(j))
`await fetch(url)` means put everything after this in the "then" block of this promise

Caching

HTTp request
GET POST PUT DELETE OPTIONS

Authentication/Authorization
authentication: who are you
Authorization: given who you are, what are you allowed to do

Secure password storage:
Bcrypt library handles secure password hashing
Salting, hashing, comparing
Salting: 
bcrypt.hash
uuid gives unique authtoken


cookie: data automatically passed back and forth between server and client; server may update cookie and send updated cookie back with response; browser will store new cookie and send it back
cookies often store authtokens

cookie fields: secure; HttpOnly; SameSite=Strict 
These are all important for security; (optional Expires field)



Express: 

`var ptr = React.useRef()` makes a container/pointer for a value
`<div ref={ptr}></div>` means store this HTML element in ptr
ptr.current is like a dereference?



Here's my rudimentary model of a Promise object (in pseudocode):

class Promise {  // Of course, this must all be implemented using thread-safety practices
// Also, I'm guessing when it compiles, if there is no .then, .catch, or .finally specified,
// the computer fills it in with an empty function
  public:

  constructor(fun1) {
    this.finalVal = null;
    this.isPending = true;
    this.isResolved = false;
    this.thenFunction = null;
    this.catchFunction = null;
    this.finallyFunction = null;
    // guard the latter three functions with semaphores; set them all to "blocked"
    startNewThread(task: activate(fun1));
  }

  fun activate(fun1) {
    fun1(this.resolve, this.reject);
    wait until isPending is false
    if this.isResolved:
      wait for access from the semaphore, then do:
      thenFunction(finalVal);
    else:
      wait for access from the semaphore, then do:
      catchFunction(finalVal);

    wait for access from the semaphore, then do:
    finallyFunction(finalVal);
  }

  fun then(fun1) {
    // semaphore already has access reserved for us
    this.thenFunction = fun1;
    release access
  }
  
  fun catch(fun1) {
    // semaphore already has access reserved for us
    this.catchFunction = fun1;
    release access
  }
  
  fun finally(fun1) {
    // semaphore already has access reserved for us
    this.finallyFunction = fun1;
    release access
  }
  
  private:

  fun resolve(resultVal) {
    this.finalVal = resultVal;
    this.isResolved = true;
    this.isPending = false;
  }

  fun reject(rejectVal) {
    this.finalVal = rejectVal;
    this.isPending = false;
  }
}

CanvasRenderingContext2D object can be obtained with `anyObject.current.getContext("2d")`
`gameWindow.drawImage(image, left, top, width, height)`

To load an image,
`var img = new Image();`
`img.src = "path/to/image/file";`
create a Promise that sets `img.onload = () => {resolve(img);};`
the Promise's result will then be the fully fleshed-out image

Each call to requestAnimationFrame sets the browser to update the graphics once (assuming you pass it a function that updates the graphics) as soon as the browser is about to re-render the page (usually every 1/60th of a second). Usually people make the callback function call requestAnimationFrame, so that it follows a continuous cycle of updating the graphics at regular intervals, but if the callback function doesn't call requestAnimationFrame again, then requestAnimationFrame only updates the graphics once.


To pass state up, pass a setter function (obtained using React.useState()) down!

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

Flex property:
body {
    flex: 0 30px; /* 0 means */
    flex-direction: column
}
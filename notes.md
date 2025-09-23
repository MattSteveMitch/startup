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
<p style="color:green">Text here!</p>

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


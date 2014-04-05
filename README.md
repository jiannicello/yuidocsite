# yuidocsite


node.js site that adds Everything search tab to yuidocs. 


## Pre-Setup

install yuidocjs

    npm -g i yuidocjs

## Installation

    npm install -g yuidocsite


## Site setup

1) create empty [sitefolder] directory where docs site will live

2) create a sub folder called **docs** in [sitefolder]


3) run **yuidoc** to create outut into **docs** sub folder. 

For example in source folder somewhere with yuidoc.json file of:

    {
    	"name": "Test Doc Site",
    	"description": "Test Doc Site",
    	"version": "0.0.1",
    	"options": {
		"outdir": "<pathto sitefolder>/docs",
		"paths": "./src"
    	}
	}
	
run yuidoc:

    yuidoc -c ./yuidoc.json

4) inside of [sitefolder] directory run **yuidocsite**

````
    yuidocsite --port 3000
````

5) go to site url in browser

````
http://localhost:3000
````

6) In Everything tab search for functions, attributes, properties by default 

## Additional Options

To search for text in documentation descriptions specify **search_desc** when starting up site

````
	yuidocsite --port 3000 --search_desc
````

## Notes

The app watches the yuidoc json file with the documentation metadata. So, while the site is up, 
everytime you run yuidoc and re-populate the **docs** subfolder, the new documentation changes 
are searchable without a site restart.


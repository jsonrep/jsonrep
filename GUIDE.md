
This **Guide** is best viewed at [jsonrep.github.io/jsonrep](https://jsonrep.github.io/jsonrep/) using a *Modern Browser*.

> Use `jsonrep` to present JSON Documents beautifully and easily!

`jsonrep` is a JavaScript library for use in the *Browser* and on the *Server*
(for pre-compiling) to *mark up* **JSON Documents** for **Visualization and Interaction**.

An *Annotated JSON Document* using *URL-referenced JavaScript Renderers* which may be
nested arbitrarily looks like this:

```json
{
    "@./dist/div": {
        "css": {
            "padding": "5px",
            "border": "1px solid black"
        },
        "innerHTML": {
            "@./dist/io.shields.img": {
                "subject": "jsonrep",
                "status": "Rocks!",
                "color": "green"
            }
        }
    }
}
```
RESULT: <div renderer="jsonrep">&CODE&</div>

Treat this format as a **compile target** capable of holding *just-in-time linked nested data structures*.


Loading
=======

Load the `jsonrep` library into a HTML page using:
```html
<script src="./dist/jsonrep.js"></script>
<script>
    const JSONREP = window.jsonrep;
</script>
```

It can also be loaded into a *CommonJS Process* using:

```javascript
const JSONREP = require("jsonrep");
```

<!--
// This code is used when running the rendered guide in a browser.
INJECT>>>
<script src="./lib/jsonrep.js"></script>
<style>
    DIV[renderer="jsonrep"] {
        display: inline-block;
    }
</style>
<<<INJECT
-->


Introduction
============

`jsonrep` **marks up** any DOM elements tagged using a `renderer="jsonrep"` attribute:

```html
<div renderer="jsonrep">{"message": "Hello World!"}</div>
```
RESULT: &CODE&

The DOM is automatically *marked up* on the `DOMContentLoaded` document event which can be re-triggered (in case new tags have been added) using:

```javascript
JSONREP.markupDocument();
```

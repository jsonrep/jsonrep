
This **Guide** is best viewed at [jsonrep.github.io/jsonrep](https://jsonrep.github.io/jsonrep/) using a *Modern Browser*.

> Use `jsonrep` to present JSON Documents beautifully and easily!

`jsonrep` is a JavaScript library for use in the *Browser* and on the *Server*
(for pre-compiling) to *mark up* **JSON Documents** for **Visualization and Interaction**
using *JavaScript Representations* (**rep[s]**).

An *Annotated JSON Document* using *URL-referenced JavaScript Renderers* which may be
nested arbitrarily looks like this:

```json
{
    "@dist/div": {
        "style": {
            "padding": "5px",
            "border": "1px solid black"
        },
        "innerHTML": {
            "@dist/io.shields.img": {
                "subject": "jsonrep",
                "status": "Rocks!",
                "color": "green"
            }
        }
    }
}
```
<!--ON_RUN>>>
RESULT: <div renderer="jsonrep">&CODE&</div>
<<<ON_RUN-->

Treat this format as a **compile target** capable of holding *just-in-time linked nested data structures*.


Integration
===========

HTML Page
---------

Load the `jsonrep` library into a HTML page using:
```html
<script src="https://jsonrep.github.io/jsonrep/dist/jsonrep.js"></script>
<script>
    const JSONREP = window.jsonrep;
</script>
```

When used in a HTML page, `jsonrep` **marks up** any DOM elements tagged using a `renderer="jsonrep"` attribute:

```html
<div renderer="jsonrep">{"message": "Hello World!"}</div>
```
<!--ON_RUN>>>
RESULT: &CODE&
<<<ON_RUN-->

The DOM is automatically *marked up* on the `DOMContentLoaded` document event. *Marking up* can be re-triggered (in case new tags have been added) using:

```javascript
JSONREP.markupDocument();
```

CommonJS Environment
--------------------

`jsonrep` can also be loaded into a CommonJS Environment using:

```javascript
const JSONREP = require("jsonrep");
```

When loaded into a CommonJS Environment (which has a global **exports** object available) only the `jsonrep`
API is exported WITHOUT *marking up* a DOM that may also be present in the environment.

<!--ON_RUN>>>
<script src="./dist/jsonrep.js"></script>
<style>
    DIV[renderer="jsonrep"] {
        display: inline-block;
    }
</style>
<<<ON_RUN-->


API
===

HTML
----

  * **markupDocument()** - Scan the DOM for `renderer="jsonrep"` and *mark up* any found elements.

  * **markupElement( `<DOM_Element>` )** - *Mark up* the specified `<DOM_Element>`.

CommonJS
--------

  * **markupNode( `<JSON_Node>` )** - Generate the *mark up* for the specified `<JSON_Node>`.


Examples
========

### JavaScript Primitives

The default *reps* for [JavaScript Primitives](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures).

```html
[
    null,
    "string",
    0,
    1.2,
    [ "item" ],
    { "key": "value" }
]
```
<!--ON_RUN>>>
RESULT: <div renderer="jsonrep">&CODE&</div>
<<<ON_RUN-->

### Golden Layout

A *rep* for the [golden-layout.com](http://golden-layout.com/) multi-screen layout manager.

```html
{
    "@dist/golden-layout": {
        "content": [ {
            "type": "row",
            "content": [
                {
                    "type": "component",
                    "componentName": "example",
                    "title": "Default Rendering",
                    "componentState": { "text": "Component 1" }
                }, {
                    "type": "component",
                    "componentName": "example",
                    "title": "Custom Rep",
                    "componentState": {
                        "@dist/io.shields.img": {
                            "subject": "jsonrep",
                            "status": "Rocks!",
                            "color": "blue"
                        }                        
                    }
                }
            ]
        } ]
    }
}
```
<!--ON_RUN>>>
<style>
.lm_goldenlayout .lm_content > DIV {
    padding: 10px;
}
</style>

RESULT: <div renderer="jsonrep" style="width: 100%; height:100px;">&CODE&</div>
<<<ON_RUN-->

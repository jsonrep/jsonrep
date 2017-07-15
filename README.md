
**Stability: Experimental. Use at your own risk!**

| License | Source | &#8212;&raquo; | [Website](https://github.com/jsonrep/jsonrep/tree/master/workspace.sh) | [npm](https://github.com/npm/npm) |
| :---: | :---: | :---: | :---: | :---: |
| [MPL](https://opensource.org/licenses/MPL-2.0) | [github.com/jsonrep/jsonrep](https://github.com/jsonrep/jsonrep) | [![CircleCI](https://circleci.com/gh/jsonrep/jsonrep.svg?style=svg)](https://circleci.com/gh/jsonrep/jsonrep) | [jsonrep.github.io/jsonrep](https://jsonrep.github.io/jsonrep) | [jsonrep](https://www.npmjs.com/package/jsonrep)


[jsonrep](https://jsonrep.github.io/jsonrep)
===


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


<script src="./dist/jsonrep.js"></script>
<style>
    DIV[renderer="jsonrep"] {
        display: inline-block;
    }
</style>


Introduction
============

`jsonrep` **marks up** any DOM elements tagged using a `renderer="jsonrep"` attribute:

```html
<div renderer="jsonrep">{"message": "Hello World!"}</div>
```

The DOM is automatically *marked up* on the `DOMContentLoaded` document event which can be re-triggered (in case new tags have been added) using:

```javascript
JSONREP.markupDocument();
```


Provenance
==========

Original Source Logic under [Mozilla Public License 2.0](https://opensource.org/licenses/MPL-2.0) by [Christoph Dorn](http://christophdorn.com) since 2017.

```
Mozilla Public License 2.0

You are free to:
    Commercial Use, Modify, Distribute, Sublicense, Place Warranty, Use Patent Claims

Under the following terms:
    Include Copyright, Include License, Disclose Source, Include Original

You cannot:
    Use Trademark, Hold Liable
```

> Well-crafted Contributions are Welcome.

**INTENDED USE:** The *Logic and Code contained within* forms a **Developer Tool** and is intended to operate as part of a *Web Software Development Toolchain* on which a *Production System* operates indirectly. It is **NOT INTENDED FOR USE IN HIGH-LOAD ENVIRONMENTS** as there is *little focus on Runtime Optimization* in order to *maximize API Utility, Compatibility and Flexibility*.

If you *need more* than what is contained within, study the Code, understand the Logic, and build your *Own Implementation* that is *API Compatible*. Share it with others who follow the same *Logic* and *API Contract* specified within. This Community of Users will likely want to use Your Work in their own *Software Development Toolchains*.

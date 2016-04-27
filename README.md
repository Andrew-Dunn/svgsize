![svgsize](https://cdn.rawgit.com/Andrew-Dunn/svgsize/master/assets/svgsize-logo.svg)
===

Summary
---
**svgsize** is a JavaScript library that can parse an SVG vector image document
and extract information about its dimensions. It works by parsing the SVG XML
document using the excellent **xmldom** library.

Installation
---
To install **svgsize**, simply run:

```shell
npm install svgsize
```

Usage
---
```JavaScript
var fs = require('fs');
var svgsize = require('svgsize');

var contents = fs.readFileSync('example.svg', 'utf8');

// Calling svgsize() will parse the given SVG file and calculate its
// size. If an error occurs during parsing, it will throw an error.
var dimensions = svgsize(contents);

// .width will give the width of the file in pixels.
console.log(dimensions.width);

// .height will give the height of the file in pixels.
console.log(dimensions.height);
```

License
---
**svgsize** is licensed under the Apache License, Version 2.0.
You may obtain a copy of the license at
http://www.apache.org/licenses/LICENSE-2.0.

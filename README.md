![svginfo](assets/svginfo-logo.svg)
===

Summary
---
**svginfo** is a JavaScript library that can
parse an SVG vector image document and extract information about its dimensions.
It works by parsing the SVG XML document using the excellent
**xmldom**<sup>[\[repo]][xmldom-repo][\[npm]][xmldom-npm]</sup> library.

Usage
---
```JavaScript
var fs = require('fs');
var SVGInfo = require('svginfo').SVGInfo;

var contents = fs.readFileSync('example.svg', 'utf8');

// Constructing a new SVGInfo object will parse the SVG file and calculate its
// size. If an error occurs during parsing, it will throw an error.
var dimensions = new SVGInfo(contents);

// SVGInfo::width will give the width of the file in pixels.
console.log(dimensions.width);

// SVGInfo::height will give the height of the file in pixels.
console.log(dimensions.height);
```

License
---
**svginfo** is licensed under the Apache License, Version 2.0.
You may obtain a copy of the license at
http://www.apache.org/licenses/LICENSE-2.0.

[xmldom-repo]: https://github.com/jindw/xmldom
[xmldom-npm]:  https://www.npmjs.com/package/xmldom

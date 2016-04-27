/*
 * Copyright 2016 Andrew Dunn.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

module.exports = (function() {
    let DOMParser = require('xmldom').DOMParser;
    let parselength = require('./parselength.js');

    // Convert non px units into pixels. Obviously this is an extremely
    // imprecise art. We assume that the DPI is 90 (the SVG standard makes
    // extensive reference to this figure throughout the specification), and
    // that the font-size is 12pt. In the future it may be interesting to
    // attempt getting the actual value from the system / web-browser.
    function pixels(value) {
        const inch = 90; // pixel width of a single inch
        const fontSize = 12; //pt
        const pt = inch / 72;
        const pc = inch / 6;
        const cm = inch / 2.54;
        const mm = inch / 25.4;

        switch (value.units) {
            case '':
            case 'px':
                return value.value;
            case 'em':
                return value.value * fontSize * pt;
            case 'ex':
                // Let's just assume the x-height is half that of the em-height,
                // just like Internet Explorer. (Oh god what has happened to me)
                return value.value * fontSize * 0.5 * pt;
            case 'pt':
                return value.value * pt;
            case 'pc':
                return value.value * pc;
            case 'cm':
                return value.value * cm;
            case 'mm':
                return value.value * mm;
            case 'in':
                return value.value * inch;
            default:
                throw new Error(`Could not get pixel size of unknown unit: ${value.units}.`);
        }
    }

    function svgsize(buffer) {
        let xml = new DOMParser().parseFromString(buffer, 'image/svg+xml');

        if (xml.documentElement === null) {
            throw new Error('The provided input was not an XML document.');
        } else if (xml.documentElement.tagName != 'svg') {
            throw new Error('The provided input was not an SVG image.')
        }

        let svg = xml.documentElement;
        let attrs = {};
        for (let i = 0; i < svg.attributes.length; ++i) {
            let attr = svg.attributes[i];
            attrs[attr.nodeName] = attr.nodeValue;
        }

        if (attrs.width === undefined && attrs.height === undefined && attrs.viewBox == undefined) {
            throw new Error('The SVG image did not specify its dimensions.');
        }
        if (attrs.width === undefined) {
            if (attrs.viewBox === undefined) {
                throw new Error('The SVG image did not specify its width or a viewBox.');
            } else {
                // Set to 100% so that we'll use the size of the viewBox instead.
                attrs.width = '100%';
            }
        }
        if (attrs.height === undefined) {
            if (attrs.viewBox === undefined) {
                throw new Error('The SVG image did not specify its height or a viewBox.');
            } else {
                attrs.height = '100%';
            }
        }

        let width = 0;
        try {
            width = parselength(attrs.width);
        } catch (err) {
            throw new Error(`The SVG image had an invalid width value: '${attrs.width}'.`);
        }
        let height = 0;
        try {
            height = parselength(attrs.height);
        } catch (err) {
            throw new Error(`The SVG image had an invalid height value: '${attrs.height}'.`);
        }

        if (width.units === '%' || height.units === '%') {
            if (attrs.viewBox === undefined) {
                throw new Error('The SVG image had a proportional width and/or height but did not specify a viewBox.');
            }
            // Splits into four parts either by whitespace or a comma.
            let parts = attrs.viewBox.split(/(?:\s*,\s*|\s+)/);
            if (parts.length !== 4) {
                throw new Error(`The SVG image's viewBox had ${parts.length} items, not 4.`);
            }

            let viewWidth, viewHeight;
            try {
                viewWidth = parselength(parts[2]);
                // Not supposed to have units. Just throw anything to
                // trigger the real error.
                if (viewWidth.units !== '') throw false;
            } catch (err) {
                throw new Error(`The SVG viewBox had an invalid width value: '${parts[2]}'.`);
            }
            try {
                viewHeight = parselength(parts[3]);
                if (viewHeight.units !== '') throw false;
            } catch (err) {
                throw new Error(`The SVG viewBox had an invalid height value: '${parts[3]}'.`);
            }

            if (width.units === '%') {
                width.value = width.value * 0.01 * viewWidth.value;
                width.units = 'px';
            }
            if (height.units === '%') {
                height.value = height.value * 0.01 * viewHeight.value;
                height.units = 'px';
            }
        }

        return {
            'width': pixels(width),
            'height': pixels(height)
        };
    }

    return svgsize;
})();

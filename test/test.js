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

let svgsize = require('../');

let chai = require('chai');
let expect = chai.expect;
let fs = require('fs');
let parselength = require('../lib/parselength.js');
chai.use(require('chai-fuzzy'));

describe('The svgsize JavaScript library', () => {
    describe('Parsing SVG lengths', () => {
        it('should be able to parse all valid SVG length values', () => {
            expect(parselength('0')).to.be.like({value:0,units:''});
            expect(parselength('0px')).to.be.like({value:0,units:'px'});
            expect(parselength('0em').units).to.equal('em');
            expect(parselength('0ex').units).to.equal('ex');
            expect(parselength('0in').units).to.equal('in');
            expect(parselength('0cm').units).to.equal('cm');
            expect(parselength('0mm').units).to.equal('mm');
            expect(parselength('0pt').units).to.equal('pt');
            expect(parselength('0pc').units).to.equal('pc');
            expect(parselength('0%').units).to.equal('%');
            expect(parselength('+50em')).to.be.like({value:50,units:'em'});
            expect(parselength('50ex')).to.be.like({value:50,units:'ex'});
            expect(parselength('-50in')).to.be.like({value:-50,units:'in'});
            expect(parselength('+50.766cm')).to.be.like({value:50.766,units:'cm'});
            expect(parselength('50.766mm')).to.be.like({value:50.766,units:'mm'});
            expect(parselength('-50.766pt')).to.be.like({value:-50.766,units:'pt'});
            expect(parselength('+.339pc')).to.be.like({value:0.339,units:'pc'});
            expect(parselength('.423px')).to.be.like({value:0.423,units:'px'});
            expect(parselength('-.766%')).to.be.like({value:-0.766,units:'%'});
            expect(parselength('4E0em')).to.be.like({value:4,units:'em'});
            expect(parselength('4e1ex')).to.be.like({value:40,units:'ex'});
            expect(parselength('-6E2in')).to.be.like({value:-600,units:'in'});
            expect(parselength('-6e3cm')).to.be.like({value:-6000,units:'cm'});
            expect(parselength('+8E4mm')).to.be.like({value:80000,units:'mm'});
            expect(parselength('+8e5pt')).to.be.like({value:800000,units:'pt'});
            expect(parselength('4E-0em')).to.be.like({value:4,units:'em'});
            expect(parselength('4e-1ex')).to.be.like({value:0.4,units:'ex'});
            expect(parselength('-6E-2in')).to.be.like({value:-0.06,units:'in'});
            expect(parselength('-6e-3cm')).to.be.like({value:-0.006,units:'cm'});
            expect(parselength('+8E-4mm')).to.be.like({value:0.0008,units:'mm'});
            expect(parselength('+8e-5pt')).to.be.like({value:0.00008,units:'pt'});
            expect(parselength('123.456e2pt')).to.be.like({value:12345.6,units:'pt'});
            expect(parselength('123.456E-2px')).to.be.like({value:1.23456,units:'px'});
            expect(parselength('-123.456E2cm')).to.be.like({value:-12345.6,units:'cm'});
            expect(parselength('-123.456e-2mm')).to.be.like({value:-1.23456,units:'mm'});
            expect(parselength('.789E2em')).to.be.like({value:78.9,units:'em'});
            expect(parselength('.68e-1ex')).to.be.like({value:0.068,units:'ex'});
            expect(parselength('-.484E2in')).to.be.like({value:-48.4,units:'in'});
            expect(parselength('-.484e-2pc')).to.be.like({value:-0.00484,units:'pc'});
        });
    });
    describe('Parsing SVG files', () => {
        it('should throw an error if the input is not XML', () => {
            let contents = fs.readFileSync('assets/svgsize-logo.svg', 'utf8');
            expect(() => {
                svgsize('foobar')
            }).to.throw(Error, "The provided input was not an XML document.");
        });

        it('should throw an error if the input is not an SVG image', () => {
            expect(() => {
                svgsize('<foobar></foobar>')
            }).to.throw(Error, "The provided input was not an SVG image.");
        });

        it("should throw an error if the SVG image doesn't specify the dimensions.", () => {
            expect(() => {
                svgsize('<svg></svg>')
            }).to.throw(Error, "The SVG image did not specify its dimensions.");
            expect(() => {
                svgsize('<svg width="100px"></svg>')
            }).to.throw(Error, "The SVG image did not specify its height or a viewBox.");
            expect(() => {
                svgsize('<svg height="100px"></svg>')
            }).to.throw(Error, "The SVG image did not specify its width or a viewBox.");

            expect(() => {
                svgsize('<svg width="100%" height="100px"></svg>')
            }).to.throw(Error, "The SVG image had a proportional width and/or height but did not specify a viewBox.");
            expect(() => {
                svgsize('<svg width="100px" height="100%"></svg>')
            }).to.throw(Error, "The SVG image had a proportional width and/or height but did not specify a viewBox.");
            expect(() => {
                svgsize('<svg width="100%" height="100%"></svg>')
            }).to.throw(Error, "The SVG image had a proportional width and/or height but did not specify a viewBox.");
        });

        it("should throw an error if the SVG image had invalid dimensions specified.", () => {
            expect(() => {
                svgsize('<svg width="foo" height="100%"></svg>')
            }).to.throw(Error, "The SVG image had an invalid width value: 'foo'.");
            expect(() => {
                svgsize('<svg width="0" height="100m"></svg>')
            }).to.throw(Error, "The SVG image had an invalid height value: '100m'.");
            expect(() => {
                svgsize('<svg width="5" height="100%" viewBox="0 0 , 49"></svg>')
            }).to.throw(Error, "The SVG image's viewBox had 3 items, not 4.");
            expect(() => {
                svgsize('<svg width="5" height="100%" viewBox="0 0 , 49   70,2"></svg>')
            }).to.throw(Error, "The SVG image's viewBox had 5 items, not 4.");

            expect(() => {
                svgsize('<svg width="5" height="100%" viewBox="0 0 foo 2"></svg>')
            }).to.throw(Error, "The SVG viewBox had an invalid width value: 'foo'.");
            expect(() => {
                svgsize('<svg width="5" height="100%" viewBox="0 0 100px 2"></svg>')
            }).to.throw(Error, "The SVG viewBox had an invalid width value: '100px'.");
            expect(() => {
                svgsize('<svg width="5" height="100%" viewBox="0 0 100 bar"></svg>')
            }).to.throw(Error, "The SVG viewBox had an invalid height value: 'bar'.");
            expect(() => {
                svgsize('<svg width="5" height="100%" viewBox="0 0 100 200%"></svg>')
            }).to.throw(Error, "The SVG viewBox had an invalid height value: '200%'.");
        });

        it("should return an object with the pixel dimensions of a valid SVG image.", () => {
            let info = svgsize('<svg width="512" height="128"></svg>');
            expect(info.width).to.equal(512);
            expect(info.height).to.equal(128);
            info = svgsize('<svg width="100px" height="960px"></svg>');
            expect(info.width).to.equal(100);
            expect(info.height).to.equal(960);
            info = svgsize('<svg width="210mm" height="297mm"></svg>');
            expect(info.width).to.equal(210 * 90/25.4);
            expect(info.height).to.equal(297 * 90/25.4);
            info = svgsize('<svg width="2in" height="1in"></svg>');
            expect(info.width).to.equal(180);
            expect(info.height).to.equal(90);
            info = svgsize('<svg width="1cm" height="14cm"></svg>');
            expect(info.width).to.equal(90 / 2.54);
            expect(info.height).to.equal(14 * 90 / 2.54);
            info = svgsize('<svg width="12pt" height="1em"></svg>');
            expect(info.width).to.equal(12 * 90 / 72);
            expect(info.height).to.equal(info.width);
            info = svgsize('<svg width="12ex" height="1pc"></svg>');
            expect(info.width).to.equal(12 * 0.5 * 12 * 90 / 72);
            expect(info.height).to.equal(90 / 6);
        });

        it("should derive the dimensions from the viewBox if the width and/or height is provided as a percentage.", () => {
            let info = svgsize('<svg width="100%" height="100%" viewBox="0 0 653 481"></svg>');
            expect(info.width).to.equal(653);
            expect(info.height).to.equal(481);
            info = svgsize('<svg width="160%" height="2%" viewBox="0 0 23 481"></svg>');
            expect(info.width).to.equal(23 * 1.6);
            expect(info.height).to.equal(481 * 0.02);
            info = svgsize('<svg width="110.5%" height="182" viewBox="0 0 240e3 481"></svg>');
            expect(info.width).to.equal(240000 * 1.105);
            expect(info.height).to.equal(182);
            info = svgsize('<svg width="11px" height="182%" viewBox="0 0 240 499"></svg>');
            expect(info.width).to.equal(11);
            expect(info.height).to.equal(499 * 1.82);
            info = svgsize('<svg width="512px" height="900" viewBox="0 0 240 499"></svg>');
            expect(info.width).to.equal(512);
            expect(info.height).to.equal(900);
            info = svgsize('<svg viewBox="312 11.45 6773.98 742e-1"></svg>');
            expect(info.width).to.equal(6773.98);
            expect(info.height).to.equal(74.2);
        });
    });
});

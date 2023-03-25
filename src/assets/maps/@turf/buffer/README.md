# @turf/buffer

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

## buffer

Calculates a buffer for input features for a given radius. Units supported are miles, kilometers, and degrees.

When using a negative radius, the resulting geometry may be invalid if
it's too small compared to the radius magnitude. If the input is a
FeatureCollection, only valid members will be returned in the output
FeatureCollection - i.e., the output collection may have fewer members than
the input, or even be empty.

**Parameters**

-   `geojson` **([FeatureCollection][1] \| [Geometry][2] \| [Feature][3]&lt;any>)** input to be buffered
-   `radius` **[number][4]** distance to draw the buffer (negative values are allowed)
-   `options` **[Object][5]** Optional parameters (optional, default `{}`)
    -   `options.units` **[string][6]** any of the options supported by turf units (optional, default `"kilometers"`)
    -   `options.steps` **[number][4]** number of steps (optional, default `8`)

**Examples**

```javascript
var point = turf.point([-90.548630, 14.616599]);
var buffered = turf.buffer(point, 500, {units: 'miles'});

//addToMap
var addToMap = [point, buffered]
```

Returns **([FeatureCollection][1] \| [Feature][3]&lt;([Polygon][7] \| [MultiPolygon][8])> | [undefined][9])** buffered features

[1]: https://tools.ietf.org/html/rfc7946#section-3.3

[2]: https://tools.ietf.org/html/rfc7946#section-3.1

[3]: https://tools.ietf.org/html/rfc7946#section-3.2

[4]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number

[5]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object

[6]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String

[7]: https://tools.ietf.org/html/rfc7946#section-3.1.6

[8]: https://tools.ietf.org/html/rfc7946#section-3.1.7

[9]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/undefined

<!-- This file is automatically generated. Please don't edit it directly:
if you find an error, edit the source file (likely index.js), and re-run
./scripts/generate-readmes in the turf project. -->

---

This module is part of the [Turfjs project](http://turfjs.org/), an open source
module collection dedicated to geographic algorithms. It is maintained in the
[Turfjs/turf](https://github.com/Turfjs/turf) repository, where you can create
PRs and issues.

### Installation

Install this module individually:

```sh
$ npm install @turf/buffer
```

Or install the Turf module that includes it as a function:

```sh
$ npm install @turf/turf
```
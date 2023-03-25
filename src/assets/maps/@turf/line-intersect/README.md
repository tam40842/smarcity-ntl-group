# @turf/line-intersect

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

## lineIntersect

Takes any LineString or Polygon GeoJSON and returns the intersecting point(s).

**Parameters**

-   `line1` **([Geometry][1] \| [FeatureCollection][2] \| [Feature][3]&lt;([LineString][4] \| [MultiLineString][5] \| [Polygon][6] \| [MultiPolygon][7])>)** any LineString or Polygon
-   `line2` **([Geometry][1] \| [FeatureCollection][2] \| [Feature][3]&lt;([LineString][4] \| [MultiLineString][5] \| [Polygon][6] \| [MultiPolygon][7])>)** any LineString or Polygon

**Examples**

```javascript
var line1 = turf.lineString([[126, -11], [129, -21]]);
var line2 = turf.lineString([[123, -18], [131, -14]]);
var intersects = turf.lineIntersect(line1, line2);

//addToMap
var addToMap = [line1, line2, intersects]
```

Returns **[FeatureCollection][2]&lt;[Point][8]>** point(s) that intersect both

[1]: https://tools.ietf.org/html/rfc7946#section-3.1

[2]: https://tools.ietf.org/html/rfc7946#section-3.3

[3]: https://tools.ietf.org/html/rfc7946#section-3.2

[4]: https://tools.ietf.org/html/rfc7946#section-3.1.4

[5]: https://tools.ietf.org/html/rfc7946#section-3.1.5

[6]: https://tools.ietf.org/html/rfc7946#section-3.1.6

[7]: https://tools.ietf.org/html/rfc7946#section-3.1.7

[8]: https://tools.ietf.org/html/rfc7946#section-3.1.2

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
$ npm install @turf/line-intersect
```

Or install the Turf module that includes it as a function:

```sh
$ npm install @turf/turf
```
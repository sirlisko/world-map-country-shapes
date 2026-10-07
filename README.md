# world-map-country-shapes [![npm][npm-image]][npm-url]

> BYO World map country SVG shapes

It contains a list of countries, their SVG path shapes and the boxes around them.

## Record Example

```js
{
    id: "AD",
    shape:
      "M985.4 301.7l.1-.2.1-.2v-.1l-.2-.1-.7-.2-.3-.1-.2.1-.2.2-.1.3.1.1v.4l.1.2h.4l.3-.1.5-.3h.1z",
    bounds: [983.9, 300.8, 985.6, 302.1],
    mainland: [983.9, 300.8, 985.6, 302.1]
}
```

- `bounds`: `[minX, minY, maxX, maxY]` around every part of the country.
- `mainland`: the same around its largest landmass, so the contiguous US leaves out Alaska and Hawaii. Handy for zooming to a country or drawing it on its own.

## Exports

```js
import countries, { WIDTH, HEIGHT, VIEW_BOX } from "world-map-country-shapes";
// WIDTH = 2000, HEIGHT = 1001, VIEW_BOX = "0 0 2000 1001"
```

TypeScript types are included.

## Install

```bash
npm install world-map-country-shapes
```

## Usage (with React)

Example of Country selector. See a [live example](https://codesandbox.io/embed/185q6myqq7).

```js
import React, { Component } from "react";
import country, { VIEW_BOX } from "world-map-country-shapes";

class Map extends Component {
  state = {
    selectedCountries: {}
  };
  toggleCountry = country => {
    const { selectedCountries } = this.state;
    this.setState({
      selectedCountries: {
        ...selectedCountries,
        [country.id]: !selectedCountries[country.id]
      }
    });
  };
  render() {
    const { selectedCountries } = this.state;
    const mapCountries = country.map(country => (
      <path
        key={country.id}
        d={country.shape}
        style={{
          fill: selectedCountries[country.id] ? "tomato" : "#eee",
          cursor: "pointer",
          stroke: "#ccc"
        }}
        onClick={() => this.toggleCountry(country)}
      />
    ));
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="400"
        width="800"
        viewBox={VIEW_BOX}
      >
        {mapCountries}
      </svg>
    );
  }
}

export default Map;
```

### Drawing one country

```js
const italy = countries.find(c => c.id === "IT");
const [minX, minY, maxX, maxY] = italy.mainland;

<svg viewBox={`${minX} ${minY} ${maxX - minX} ${maxY - minY}`}>
  <path d={italy.shape} />
</svg>
```

### Map details

- _Map type_: [Robinson Projection](https://en.wikipedia.org/wiki/Robinson_projection)
- _Country IDs (211 countries/territories)_: [2-digit ISO codes](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2)

![map][map-image]

### Changing a shape

After editing a path in `index.js`, run `npm run bounds` to recompute its boxes, then `npm test`.

### Credits

SVG map from [https://simplemaps.com/resources/svg-world](https://simplemaps.com/resources/svg-world).

[map-image]: ./world-map.svg
[npm-image]: https://img.shields.io/npm/v/world-map-country-shapes.svg
[npm-url]: https://npmjs.com/package/world-map-country-shapes

# world-map-country-shapes

[![npm][npm-image]][npm-url] [![license][license-image]](https://github.com/sirlisko/world-map-country-shapes/blob/main/LICENSE)

Bring your own world map: SVG path shapes for 210 countries and territories, keyed by ISO code.

[![World map][map-image]][demo-url]

**[Try the live demo →][demo-url]**

- **Just data.** No dependencies, no framework. Render with React, Vue, Svelte, plain DOM or a `<canvas>`.
- **Small.** All 210 countries come to about 31 kB gzipped. The boxes add an optional 4.5 kB.
- **ISO 3166-1 alpha-2 ids**, so you can join it with any country dataset.
- **Zoom-ready boxes.** An optional `bounds` entry point gives you the box around each country and around its mainland.
- **Typed.** TypeScript declarations included, with `CountryId` as a union of every code.

## Install

```bash
npm install world-map-country-shapes
```

## Usage

```js
import countries, { VIEW_BOX } from "world-map-country-shapes";

countries[0];
// { id: "AD", shape: "M985.4 301.7l.1-.2.1-.2v-.1l-.2-.1…z" }
```

Each `shape` is SVG path data in the `0 0 2000 1001` coordinate space, so drop it into the `d` of a `<path>` inside an `<svg viewBox={VIEW_BOX}>`.

### React: a clickable map

```jsx
import { useState } from "react";
import countries, { VIEW_BOX } from "world-map-country-shapes";

export function WorldMap() {
  const [selected, setSelected] = useState(new Set());

  const toggle = (id) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  return (
    <svg viewBox={VIEW_BOX} role="img" aria-label="World map">
      {countries.map(({ id, shape }) => (
        <path
          key={id}
          d={shape}
          fill={selected.has(id) ? "tomato" : "#eee"}
          stroke="#ccc"
          style={{ cursor: "pointer" }}
          onClick={() => toggle(id)}
        />
      ))}
    </svg>
  );
}
```

### Choropleth

Ids are ISO codes, so colouring by data is a lookup:

```jsx
const population = { IT: 59, FR: 68, DE: 84 /* … */ }; // millions
const fill = (value) => (value ? `hsl(10 80% ${95 - value / 3}%)` : "#eee");

<svg viewBox={VIEW_BOX}>
  {countries.map(({ id, shape }) => (
    <path key={id} d={shape} fill={fill(population[id])} />
  ))}
</svg>;
```

### Zooming to one country

Boxes live in a separate entry point, so you only download them if you use them.

```jsx
import countries from "world-map-country-shapes";
import bounds from "world-map-country-shapes/bounds";

const italy = countries.find((c) => c.id === "IT");
const [minX, minY, maxX, maxY] = bounds.IT.mainland;

<svg viewBox={`${minX} ${minY} ${maxX - minX} ${maxY - minY}`}>
  <path d={italy.shape} />
</svg>;
```

Every country has two boxes, both `[minX, minY, maxX, maxY]`:

- `bounds` covers every part of the country.
- `mainland` covers only its largest landmass, so the US leaves out Alaska and Hawaii, and Spain leaves out the Canaries.

For most countries the two are the same.

### Static SVG

The full map is also available as a file, e.g. to load with your bundler's asset handling:

```js
import mapUrl from "world-map-country-shapes/world-map.svg";
```

Countries are grey with white borders by default. They're set as SVG attributes, so any CSS overrides them when the SVG is inlined. Each `<path>` has the country's ISO code as its `id` and its English name as `data-name`.

## API

| Import | Value |
| --- | --- |
| `default` from `world-map-country-shapes` | `{ id, shape }[]`, sorted by `id` |
| `WIDTH`, `HEIGHT` | `2000`, `1001` |
| `VIEW_BOX` | `"0 0 2000 1001"` |
| `default` from `world-map-country-shapes/bounds` | `{ [id]: { bounds, mainland } }` |
| Types | `CountryId`, `CountryShape` from the main entry; `Bounds`, `CountryBounds` from `/bounds` |

The package is ESM only.

## Map details

- **Projection:** [Robinson](https://en.wikipedia.org/wiki/Robinson_projection).
- **Ids:** [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2). Territories with their own code, such as Puerto Rico (`PR`) or Greenland (`GL`), have their own shape. Parts without one, such as the Canary Islands, belong to their country.
- **Not included:** some very small states and territories that the source map leaves out, such as Vatican City, Monaco, San Marino and Bahrain, and Kosovo, which has no ISO code.

## Migrating from 1.x

- `IC` (Canary Islands) is gone. It isn't an ISO 3166-1 code, so its shape is now part of `ES`.
- The package is ESM only and exposes only the entry points above, so deep imports such as `world-map-country-shapes/index.js` no longer resolve.

## Contributing

Shapes live in `index.js`. `bounds.js` and `world-map.svg` are generated from it, so after editing a shape run:

```bash
npm run generate
npm test
```

To try the demo locally, serve the repo root with any static server and open `/demo/`:

```bash
npx serve .
```

## Credits

Map from [Simplemaps](https://simplemaps.com/resources/svg-world) (MIT).

## License

[MIT](https://github.com/sirlisko/world-map-country-shapes/blob/main/LICENSE) © Luca Lischetti

[map-image]: https://raw.githubusercontent.com/sirlisko/world-map-country-shapes/main/world-map.svg
[demo-url]: https://sirlisko.github.io/world-map-country-shapes/demo/
[npm-image]: https://img.shields.io/npm/v/world-map-country-shapes.svg
[npm-url]: https://npmjs.com/package/world-map-country-shapes
[license-image]: https://img.shields.io/npm/l/world-map-country-shapes.svg

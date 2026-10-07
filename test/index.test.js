import assert from "node:assert/strict";
import { test } from "node:test";
import countries, { HEIGHT, VIEW_BOX, WIDTH } from "../index.js";

const byId = Object.fromEntries(countries.map((c) => [c.id, c]));
const inside = (inner, outer) =>
	inner[0] >= outer[0] &&
	inner[1] >= outer[1] &&
	inner[2] <= outer[2] &&
	inner[3] <= outer[3];

test("exports the map's size", () => {
	assert.equal(VIEW_BOX, `0 0 ${WIDTH} ${HEIGHT}`);
});

test("has one entry per two-letter code", () => {
	const ids = countries.map((c) => c.id);
	assert.equal(new Set(ids).size, ids.length);
	for (const id of ids) assert.match(id, /^[A-Z]{2}$/);
});

test("keeps every country's bounds on the map, around its mainland", () => {
	for (const { id, bounds, mainland } of countries) {
		assert.ok(inside(bounds, [0, 0, WIDTH, HEIGHT]), id);
		assert.ok(inside(mainland, bounds), id);
		assert.ok(bounds[0] < bounds[2] && bounds[1] < bounds[3], id);
	}
});

test("frames the mainland without far-flung parts", () => {
	const width = ([minX, , maxX]) => maxX - minX;
	// Alaska and Hawaii; the Canaries
	assert.ok(width(byId.US.mainland) < width(byId.US.bounds) / 1.5);
	assert.ok(width(byId.ES.mainland) < width(byId.ES.bounds));
	assert.ok(inside(byId.IT.mainland, [990, 260, 1090, 345]));
});

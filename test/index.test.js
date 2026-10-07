import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import bounds from "../bounds.js";
import countries, { HEIGHT, VIEW_BOX, WIDTH } from "../index.js";

const ids = countries.map((c) => c.id);
const inside = (inner, outer) =>
	inner[0] >= outer[0] &&
	inner[1] >= outer[1] &&
	inner[2] <= outer[2] &&
	inner[3] <= outer[3];
const width = ([minX, , maxX]) => maxX - minX;

test("exports the map's size", () => {
	assert.equal(VIEW_BOX, `0 0 ${WIDTH} ${HEIGHT}`);
});

test("has one entry per ISO 3166-1 alpha-2 code", () => {
	assert.equal(new Set(ids).size, ids.length);
	for (const id of ids) assert.match(id, /^[A-Z]{2}$/);
	// Not ISO 3166-1; the Canaries are part of ES
	assert.ok(!ids.includes("IC"));
});

test("types every id", () => {
	const types = readFileSync(new URL("../index.d.ts", import.meta.url), "utf8");
	const typed = [...types.matchAll(/\| "([A-Z]{2})"/g)].map(([, id]) => id);
	assert.deepEqual(typed, ids);
});

test("has bounds for every country, in the same order", () => {
	assert.deepEqual(Object.keys(bounds), ids);
});

test("keeps every country's bounds on the map, around its mainland", () => {
	for (const [id, { bounds: all, mainland }] of Object.entries(bounds)) {
		assert.ok(inside(all, [0, 0, WIDTH, HEIGHT]), id);
		assert.ok(inside(mainland, all), id);
		assert.ok(all[0] < all[2] && all[1] < all[3], id);
	}
});

test("frames the mainland without far-flung parts", () => {
	// Alaska and Hawaii
	assert.ok(width(bounds.US.mainland) < width(bounds.US.bounds) / 1.5);
	// The Canaries and the Balearics
	assert.ok(width(bounds.ES.mainland) < width(bounds.ES.bounds) / 1.5);
	assert.ok(inside(bounds.IT.mainland, [990, 260, 1090, 345]));
	// Borneo, not the longer but smaller Sumatra
	assert.ok(bounds.ID.mainland[0] > 1580);
});

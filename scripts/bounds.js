// Adds `bounds` and `mainland` to every country in index.js. Run after editing
// a shape: `npm run bounds`. Paths only use M/L/H/V/Z, so tracking points is enough.
import { readFileSync, writeFileSync } from "node:fs";
import countries from "../index.js";

const round = (n) => Math.round(n * 10) / 10;

function subpathBoxes(path) {
	const boxes = [];
	let box = null;
	let [x, y, startX, startY] = [0, 0, 0, 0];
	for (const [, command, args] of path.matchAll(/([a-zA-Z])([^a-zA-Z]*)/g)) {
		const n = (args.match(/-?\d*\.?\d+(?:e-?\d+)?/g) ?? []).map(Number);
		const relative = command === command.toLowerCase();
		const visit = () => {
			box[0] = Math.min(box[0], x);
			box[1] = Math.min(box[1], y);
			box[2] = Math.max(box[2], x);
			box[3] = Math.max(box[3], y);
		};
		switch (command.toLowerCase()) {
			case "m":
			case "l":
				for (let i = 0; i + 1 < n.length; i += 2) {
					x = relative ? x + n[i] : n[i];
					y = relative ? y + n[i + 1] : n[i + 1];
					if (command.toLowerCase() === "m" && i === 0) {
						[startX, startY] = [x, y];
						box = [x, y, x, y];
						boxes.push(box);
					}
					visit();
				}
				break;
			case "h":
				for (const v of n) {
					x = relative ? x + v : v;
					visit();
				}
				break;
			case "v":
				for (const v of n) {
					y = relative ? y + v : v;
					visit();
				}
				break;
			case "z":
				[x, y] = [startX, startY];
				break;
			default:
				throw new Error(`Unexpected path command ${command}`);
		}
	}
	return boxes;
}

const area = ([minX, minY, maxX, maxY]) => (maxX - minX) * (maxY - minY);

const entries = countries.map(({ id, shape }) => {
	const boxes = subpathBoxes(shape);
	const bounds = boxes.reduce((a, b) => [
		Math.min(a[0], b[0]),
		Math.min(a[1], b[1]),
		Math.max(a[2], b[2]),
		Math.max(a[3], b[3]),
	]);
	const mainland = boxes.reduce((a, b) => (area(b) > area(a) ? b : a));
	return { id, shape, bounds: bounds.map(round), mainland: mainland.map(round) };
});

const source = readFileSync(new URL("../index.js", import.meta.url), "utf8");
const header = source.slice(0, source.indexOf("export default"));
const body = entries
	.map(
		({ id, shape, bounds, mainland }) =>
			`  {\n    id: "${id}",\n    shape:\n      "${shape}",\n    bounds: [${bounds.join(", ")}],\n    mainland: [${mainland.join(", ")}]\n  }`,
	)
	.join(",\n");
writeFileSync(
	new URL("../index.js", import.meta.url),
	`${header}export default [\n${body}\n];\n`,
);
console.log(`Bounds for ${entries.length} countries`);

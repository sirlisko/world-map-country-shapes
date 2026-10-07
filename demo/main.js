import countries, { VIEW_BOX } from "world-map-country-shapes";
import bounds from "world-map-country-shapes/bounds";

const map = document.getElementById("map");
const select = document.getElementById("country");
const overseas = document.getElementById("overseas");
const caption = document.getElementById("caption");
const code = document.getElementById("code");

// ISO alpha-2 ids give localised names for free
const names = new Intl.DisplayNames([navigator.language, "en"], { type: "region" });
const nameOf = (id) => names.of(id) ?? id;

const paths = new Map();
for (const { id, shape } of countries) {
	const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
	path.setAttribute("d", shape);
	path.dataset.id = id;
	const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
	title.textContent = nameOf(id);
	path.append(title);
	map.append(path);
	paths.set(id, path);
}

for (const id of [...paths.keys()].sort((a, b) => nameOf(a).localeCompare(nameOf(b)))) {
	select.add(new Option(nameOf(id), id));
}

// Pad the box so small countries and coastlines don't touch the edges
function viewBoxFor([minX, minY, maxX, maxY]) {
	const pad = Math.max(maxX - minX, maxY - minY) * 0.15 + 2;
	return [minX - pad, minY - pad, maxX - minX + pad * 2, maxY - minY + pad * 2]
		.map((n) => Math.round(n * 10) / 10)
		.join(" ");
}

let current = null;
let animation = null;

function animateViewBox(to) {
	const from = map.getAttribute("viewBox").split(" ").map(Number);
	const target = to.split(" ").map(Number);
	cancelAnimationFrame(animation);
	if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
		map.setAttribute("viewBox", to);
		return;
	}
	const start = performance.now();
	const step = (now) => {
		const t = Math.min((now - start) / 600, 1);
		const ease = 1 - (1 - t) ** 3;
		map.setAttribute("viewBox", from.map((f, i) => f + (target[i] - f) * ease).join(" "));
		if (t < 1) animation = requestAnimationFrame(step);
	};
	animation = requestAnimationFrame(step);
}

function show(id) {
	paths.get(current)?.classList.remove("selected");
	current = id || null;
	select.value = id ?? "";

	if (!current) {
		animateViewBox(VIEW_BOX);
		caption.textContent = "Click a country to zoom to it.";
		code.textContent = `import countries, { VIEW_BOX } from "world-map-country-shapes";

<svg viewBox={VIEW_BOX}>
  {countries.map(({ id, shape }) => <path key={id} d={shape} />)}
</svg>`;
		return;
	}

	const path = paths.get(current);
	path.classList.add("selected");
	map.append(path); // Draw on top so its outline isn't covered by neighbours

	const key = overseas.checked ? "bounds" : "mainland";
	const box = bounds[current][key];
	animateViewBox(viewBoxFor(box));
	caption.textContent = `${nameOf(current)} (${current})`;
	code.textContent = `import bounds from "world-map-country-shapes/bounds";

bounds.${current}.${key};
// [${box.join(", ")}]`;
}

map.setAttribute("viewBox", VIEW_BOX);
map.addEventListener("click", (event) => {
	const id = event.target.dataset?.id;
	show(id && id !== current ? id : null);
});
select.addEventListener("change", () => show(select.value));
overseas.addEventListener("change", () => current && show(current));
addEventListener("keydown", (event) => event.key === "Escape" && show(null));
show(null);

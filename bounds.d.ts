import type { CountryId } from "./index.js";

/** [minX, minY, maxX, maxY] in the `VIEW_BOX` coordinate space */
export type Bounds = [minX: number, minY: number, maxX: number, maxY: number];

export interface CountryBounds {
	/** Box around every part of the country */
	bounds: Bounds;
	/** Box around its largest landmass, e.g. the contiguous US without Alaska and Hawaii */
	mainland: Bounds;
}

declare const bounds: Record<CountryId, CountryBounds>;
export default bounds;

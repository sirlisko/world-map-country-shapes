/** [minX, minY, maxX, maxY] in map coordinates */
export type Bounds = [minX: number, minY: number, maxX: number, maxY: number];

export interface CountryShape {
	/** ISO 3166-1 alpha-2 code, e.g. "IT" */
	id: string;
	/** SVG path data, in the 0 0 2000 1001 coordinate space */
	shape: string;
	/** Box around every part of the country */
	bounds: Bounds;
	/** Box around its largest landmass, e.g. the contiguous US without Alaska and Hawaii */
	mainland: Bounds;
}

export const WIDTH: 2000;
export const HEIGHT: 1001;
/** "0 0 2000 1001" */
export const VIEW_BOX: string;

declare const countries: CountryShape[];
export default countries;

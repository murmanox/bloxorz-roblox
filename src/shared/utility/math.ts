const random_obj = new Random()

export namespace Math {
	export const QUARTER_PI = math.pi / 4
	export const HALF_PI = math.pi / 2
	export const TWO_PI = 2 * math.pi

	export function random(): number
	export function random(max: number): number
	export function random(min: number, max: number): number
	export function random(min?: number, max?: number): number {
		if (typeIs(min, "number")) {
			if (typeIs(max, "number")) {
				return random_obj.NextNumber(min, max)
			} else {
				return random_obj.NextNumber(0, min)
			}
		}
		return random_obj.NextNumber()
	}

	export function roundTo(n: number, decimals: number = 0) {
		const mult = 10 ** decimals
		return math.floor(n * mult + 0.5) / mult
	}

	export function inRange(value: number, lower: number, upper: number) {
		return value >= lower && value <= upper ? true : false
	}

	export function randomDecimal(min: number, max: number, decimals: number) {
		const mult = 10 ** decimals
		return math.random(min * mult, max * mult) / mult
	}
}

// TODO: move all to namespace
export function roundTo(n: number, decimals: number = 0) {
	const mult = 10 ** decimals
	return math.floor(n * mult + 0.5) / mult
}

export function inRange(value: number, lower: number, upper: number) {
	return value >= lower && value <= upper ? true : false
}

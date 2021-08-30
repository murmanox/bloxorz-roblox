export namespace String {
	export type StringFormatter = typeof formatNumber | typeof formatTime

	export const formatNumber = (input: number): string => {
		const input_int = math.floor(input)
		const decimals = tostring(input - input_int).sub(2, 4)

		if (tostring(input_int).size() % 3 === 0) {
			return tostring(input_int).reverse().gsub("(%d%d%d)", "%1,")[0].reverse().sub(2) + decimals
		}
		return tostring(input_int).reverse().gsub("(%d%d%d)", "%1,")[0].reverse() + decimals
	}

	export const formatTime = (time: number): string => {
		const hours = math.floor(time / 3600)
		const minutes = math.floor((time % 3600) / 60)
		const seconds = math.floor((time % 3600) % 60)

		return string.format("%d:%02d:%02d", hours, minutes, seconds)
	}
}

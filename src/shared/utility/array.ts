import { List } from "@rbxts/llama"

/**
 * Iterates through a 2d array and appends a padding value to the end of each
 * array until they're all of uniform length.
 * @param array: The array to pad
 * @param pad_value: The value to be appended to the end of each row
 */
export function pad2dArray<T>(array: T[][], pad_value: T): T[][] {
	const pad_length = math.max(...array.map((value) => value.size()))
	array.forEach((arr_to_pad) => {
		const padding_needed = pad_length - arr_to_pad.size()
		if (padding_needed === 0) {
			return
		}

		for (let i = 1; i <= padding_needed; i++) {
			arr_to_pad.push(pad_value)
		}
	})

	return array
}

type Flattened<T> = T extends Array<infer U> ? Flattened<U> : T
export function flatten<T>(input: T[]): Flattened<T>[] {
	return List.flatten(input) as unknown as Flattened<T>[]
}

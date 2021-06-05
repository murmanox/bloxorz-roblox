export namespace generator {
	/**
	 * Iterates through a 2D array row by row, yielding for each value.
	 * @param array The 2D array to iterate through
	 * @yields [row_count, column_count, value]
	 */
	export function* array2d<T>(array: T[][]) {
		for (const [row_count, row] of ipairs(array)) {
			for (const [column_count, value] of ipairs(row)) {
				yield [row_count, column_count, value] as [number, number, T]
			}
		}
	}
}

declare type PickOne<T> = {
	[K in keyof T]: Record<K, T[K]> & Partial<Record<Exclude<keyof T, K>, undefined>>
}[keyof T]

interface BoardPosition {
	row: number
	column: number
}

declare type VoidPromise = Promise<void>
declare type VoidCallback<T extends Array<unknown>> = (...args: T) => void

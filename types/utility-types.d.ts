declare type PickOne<T> = {
	[K in keyof T]: Record<K, T[K]> & Partial<Record<Exclude<keyof T, K>, undefined>>
}[keyof T]

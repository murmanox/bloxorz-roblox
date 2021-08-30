export const default_stats: PlayerStats = {
	total_time_played: 0,
	total_deaths: 0,
	total_moves: 0,
	total_levels_finished: 0,
	total_teleports: 0,
	total_buttons_pressed: 0,
	total_tiles_broken: 0,
}

type D = {
	[K in keyof PlayerStats]: Statistic<PlayerStats[K]>
}

type ChangedCallback<T> = (value: T) => void
class Statistic<T> {
	private value: T

	public changed
	private events = {
		changed: new Instance("BindableEvent") as BindableEvent<ChangedCallback<T>>,
	}

	constructor(value: T) {
		this.value = value
		this.changed = this.events.changed.Event
	}

	public getValue(): T {
		return this.value
	}

	public setValue(new_value: T): void {
		if (this.value === new_value) return
		this.value = new_value
		this.events.changed.Fire(new_value)
	}

	public destroy() {
		this.events.changed.Destroy()
	}
}

function newStat<K>(value: K) {
	return new Statistic<K>(value)
}

export function playerStatsToStatistics(stats: PlayerStats): D {
	const d = {} as D

	for (const [k, v] of pairs(stats)) {
		d[k] = newStat(v)
	}

	return d
}

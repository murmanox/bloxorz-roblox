import Signal from "@rbxts/good-signal"

class Keybind {
	/**
	 * Keeps track of all keys currently inside this keybind.
	 */
	private bound_keys = new Set<Enum.KeyCode>()
	private keys_array: Enum.KeyCode[] = []

	public events = {
		changed: new Signal<[keys: Enum.KeyCode[]]>(),
	}

	constructor(action: string, keys: Enum.KeyCode[]) {
		keys.forEach((key) => this.add(key))
	}

	/**
	 * Updates the keys_array to prevent a table being created each time getKeys is called.
	 * This might be unnecessary and also bad practise.
	 */
	private updateKeysArray() {
		this.keys_array = [...this.bound_keys]
	}

	/**
	 * Get all the keys that are currently connected to this keybind
	 * @returns An array of all key in this keybind
	 */
	public getKeys() {
		return this.keys_array
	}

	/**
	 * Add a specific key to this keybind
	 * @param key The key to be added
	 */
	public add(key: Enum.KeyCode) {
		if (this.bound_keys.add(key)) {
			this.updateKeysArray()
			this.events.changed.fire(this.getKeys())
		}
	}

	/**
	 * Remove a specific key from this keybind
	 * @param key The key to be removed
	 */
	public remove(key: Enum.KeyCode) {
		if (this.bound_keys.delete(key)) {
			this.updateKeysArray()
			this.events.changed.fire(this.getKeys())
		}
	}

	/**
	 * Remove all bound keys from this keybind
	 */
	public clear() {
		const length = this.bound_keys.size()
		this.bound_keys.clear()
		if (this.bound_keys.size() !== length) {
			this.updateKeysArray()
			this.events.changed.fire(this.getKeys())
		}
	}

	/**
	 * Check if the passed key is a member of this keybind
	 */
	public hasKey(key: Enum.KeyCode): boolean {
		return this.bound_keys.has(key)
	}
}

// TODO: Change each keybind to be an array of keys, to allow for key combinations (e.g. Shift + R to reset)
const keybinds = {
	left: new Keybind("left", [Enum.KeyCode.S]),
	right: new Keybind("right", [Enum.KeyCode.F]),
	up: new Keybind("up", [Enum.KeyCode.E]),
	down: new Keybind("down", [Enum.KeyCode.D]),
	reset: new Keybind("reset", [Enum.KeyCode.R]),
	swap: new Keybind("swap", [Enum.KeyCode.Space]),
}

export const settings = {
	keybinds: keybinds,
}

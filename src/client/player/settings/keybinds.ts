import { Action, Dynamic, Sequence } from "@rbxts/gamejoy/out/Actions"

export const settings = {
	/** List of all input actions */
	gamejoy: {
		movement: {
			left: new Dynamic("S"),
			right: new Dynamic("F"),
			up: new Dynamic("E"),
			down: new Dynamic("D"),
		},
		reset: new Dynamic("R"),
		swap: new Dynamic("Space"),
		debug: {
			state: new Dynamic(new Sequence(["LeftShift", "D"])),
			keys: new Dynamic(new Sequence(["LeftShift", "C"])),
		},
	},
}

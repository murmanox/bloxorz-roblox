import { Context } from "@rbxts/gamejoy"
import { Dynamic, Sequence } from "@rbxts/gamejoy/out/Actions"

const modifier = new Dynamic("LeftShift")

export const settings = {
	/** List of all input actions */
	gamejoy: {
		context: new Context({ RunSynchronously: true }),
		actions: {
			movement: {
				left: new Dynamic("S"),
				right: new Dynamic("F"),
				up: new Dynamic("E"),
				down: new Dynamic("D"),
			},
			reset: new Dynamic("R"),
			swap: new Dynamic("Space"),
			modifier: modifier,
			debug: {
				state: new Dynamic(new Sequence([modifier, "D"])),
				keys: new Dynamic(new Sequence([modifier, "C"])),
			},
		},
	},
}

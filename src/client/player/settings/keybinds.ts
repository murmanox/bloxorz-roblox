import { Action } from "@rbxts/gamejoy/out/Actions"

export const settings = {
	/** List of all input actions */
	gamejoy: {
		movement: {
			left: new Action("S"),
			right: new Action("F"),
			up: new Action("E"),
			down: new Action("D"),
		},
		reset: new Action("R"),
		swap: new Action("Space"),
	},
}

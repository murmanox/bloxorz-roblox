import { Context } from "@rbxts/gamejoy"
import Signal from "@rbxts/good-signal"
import Object from "@rbxts/object-utils"
import { settings } from "../settings/keybinds"

const MOVEMENT_ACTIONS = settings.gamejoy.movement
const noop = () => {}

type MovementKeyName = "left" | "right" | "up" | "down"

type OnMove = [action: MovementKeyName]
type OnSwap = []
type OnReset = []

export class PlayerInput {
	on_move = new Signal<OnMove>()
	on_swap = new Signal<OnSwap>()
	on_reset = new Signal<OnReset>()

	constructor() {
		const context = new Context({ RunSynchronously: true, OnBefore: () => true })

		context.Bind(settings.gamejoy.reset, () => this.on_reset.fire())
		context.Bind(settings.gamejoy.swap, () => this.on_swap.fire())

		// Bind movement actions with no callback. The actions will be checked later on update.
		Object.values(MOVEMENT_ACTIONS).forEach((action) => context.Bind(action, noop))
	}

	/**
	 * Connects a function to a signal that's fired each frame when a movement key is pressed
	 * @param callback The function to call when the signal is fired
	 * @returns A signal connection
	 */
	public onMove(callback: VoidCallback<OnMove>) {
		return this.on_move.connect(callback)
	}

	/**
	 * Connects a function to a signal that's fired when the swap key is pressed
	 * @param callback The function to call when the signal is fired
	 * @returns A signal connection
	 */
	public onSwap(callback: VoidCallback<OnSwap>) {
		return this.on_swap.connect(callback)
	}

	/**
	 * Connects a function to a signal that's fired when the reset key is pressed
	 * @param callback The function to call when the signal is fired
	 * @returns A signal connection
	 */
	public onReset(callback: VoidCallback<OnReset>) {
		return this.on_reset.connect(callback)
	}

	/**
	 * Checks movement keys to see if any are being held
	 */
	public checkMovement() {
		const pressed = Object.entries(MOVEMENT_ACTIONS).find(([_, action]) => action.IsActive)
		if (pressed) {
			this.on_move.fire(pressed[0])
		}
	}
}

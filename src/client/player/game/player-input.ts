import { MiddlewareAction } from "@rbxts/gamejoy/out/Actions/MiddlewareAction"
import Signal from "@rbxts/good-signal"
import { settings } from "../settings/keybinds"

const gamejoy = settings.gamejoy
const MOVEMENT_ACTIONS = gamejoy.actions.movement

type MovementKeyName = "left" | "right" | "up" | "down"

type OnMove = [action: MovementKeyName]
type OnSwap = []
type OnReset = []

const modifierMiddleware = () => !gamejoy.actions.modifier.IsActive

export class PlayerInput {
	on_move = new Signal<OnMove>()
	on_swap = new Signal<OnSwap>()
	on_reset = new Signal<OnReset>()

	private pressed: MovementKeyName[] = []

	constructor() {
		// Bind 'reset' and 'swap' actions to context
		gamejoy.context
			.Bind(gamejoy.actions.reset, () => this.on_reset.fire())
			.Bind(gamejoy.actions.swap, () => this.on_swap.fire())

		// Bind movement actions
		for (const [direction, action] of pairs(MOVEMENT_ACTIONS)) {
			// Add action to pressed array when pressed
			gamejoy.context.Bind(new MiddlewareAction(action, modifierMiddleware), () => {
				this.pressed.unshift(direction)
			})

			// Remove action from pressed array when key is released
			action.Released.Connect(() => {
				this.pressed = this.pressed.filter((dir_string) => dir_string !== direction)
			})
		}
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
		if (this.pressed.size()) {
			this.on_move.fire(this.pressed[0])
		}
	}
}

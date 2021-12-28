import Signal from "@rbxts/good-signal"
import { UserInputService } from "@rbxts/services"
import { settings } from "../settings/keybinds"

type MovementKeyName = "left" | "right" | "up" | "down"
type KeyNames = keyof typeof settings.keybinds

type OnMove = [action: MovementKeyName]
type OnSwap = []
type OnReset = []

const move_actions = ["up", "down", "left", "right"] as const
const getKeys = (action: KeyNames) => settings.keybinds[action].getKeys()
const anyKeyPressed = (keys: Enum.KeyCode[]) => keys.some((key) => UserInputService.IsKeyDown(key))

export class PlayerInput {
	on_move = new Signal<OnMove>()
	on_swap = new Signal<OnSwap>()
	on_reset = new Signal<OnReset>()

	constructor() {
		UserInputService.InputBegan.Connect((input) => this.onKeyPress(input))
	}

	onMove(callback: VoidCallback<OnMove>) {
		return this.on_move.connect(callback)
	}

	onSwap(callback: VoidCallback<OnSwap>) {
		return this.on_swap.connect(callback)
	}

	onReset(callback: VoidCallback<OnReset>) {
		return this.on_reset.connect(callback)
	}

	onKeyPress(input: InputObject) {
		// check if swap key was pressed
		const swap_pressed = anyKeyPressed(getKeys("swap"))
		if (swap_pressed) {
			this.on_swap.fire()
		}

		// check if reset key was pressed
		const reset_pressed = anyKeyPressed(getKeys("reset"))
		if (reset_pressed) {
			this.on_reset.fire()
		}
	}

	update(dt: number) {
		// check if movement key is pressed
		for (const action of move_actions) {
			const pressed = anyKeyPressed(getKeys(action))
			if (pressed) {
				this.on_move.fire(action)
				break
			}
		}
	}
}

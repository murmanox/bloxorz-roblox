import Maid from "@rbxts/maid"
import Roact, { mount, unmount } from "@rbxts/roact"
import { UserInputService } from "@rbxts/services"
import { store } from "client/user-interface/store"
import {
	TOGGLE_DISPLAY_KEYS_PRESSED,
	TOGGLE_DISPLAY_STATE,
} from "client/user-interface/store/debug/types"
import {
	ADD_GAME_MOVEMENT,
	RESET_GAME_MOVEMENT,
	SET_CHECKPOINT,
	STOP_GAME,
} from "client/user-interface/store/game/types"
import { SET_MENU } from "client/user-interface/store/menu/types"
import { ADD_TIME_PLAYED } from "client/user-interface/store/stats/types"
import App from "./app"

const background_gradients = [
	new ColorSequence(new Color3(0.85), new Color3(0.2)),
	new ColorSequence(new Color3(0.85, 0.85, 0.85), new Color3(0.2, 0.2, 0.2)),
]

export = (preview_frame: GuiObject) => {
	let running = true
	const maid = new Maid()

	const random_gradient = background_gradients[math.random(0, background_gradients.size() - 1)]
	const element = (
		<frame Size={UDim2.fromScale(1, 1)}>
			<uigradient Color={random_gradient} Rotation={90} />
			<App />
		</frame>

	)
	const handle = mount(element, preview_frame)

	maid.GiveTask(
		UserInputService.InputBegan.Connect((input) => {
			if (input.KeyCode === Enum.KeyCode.One) {
				store.dispatch({ type: ADD_GAME_MOVEMENT })
			}

			if (input.KeyCode === Enum.KeyCode.Two) {
				store.dispatch({ type: SET_CHECKPOINT })
			}

			if (input.KeyCode === Enum.KeyCode.Three) {
				store.dispatch({ type: RESET_GAME_MOVEMENT })
			}

			if (input.KeyCode === Enum.KeyCode.Four) {
				store.dispatch({ type: STOP_GAME })
				store.dispatch({ type: SET_MENU, page: "none" })
			}

			if (input.KeyCode === Enum.KeyCode.D && UserInputService.IsKeyDown("LeftShift")) {
				store.dispatch({ type: TOGGLE_DISPLAY_STATE })
			}

			if (input.KeyCode === Enum.KeyCode.C && UserInputService.IsKeyDown("LeftShift")) {
				store.dispatch({ type: TOGGLE_DISPLAY_KEYS_PRESSED })
			}
		})
	)

	task.delay(1, () => {
		while (running) {
			store.dispatch({ type: ADD_TIME_PLAYED, seconds: 1 })
			task.wait(1)
		}
	})

	return () => {
		unmount(handle)
		running = false
		maid.DoCleaning()
	}
}

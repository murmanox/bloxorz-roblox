import Roact, { mount, unmount } from "@rbxts/roact"
import { Provider } from "@rbxts/roact-rodux-hooked"
import { store } from "client/user-interface/store"
import {
	TOGGLE_DISPLAY_KEYS_PRESSED,
	TOGGLE_DISPLAY_STATE,
} from "client/user-interface/store/debug/types"
import {
	ADD_DEATH,
	ADD_BUTTON_PRESSED,
	ADD_LEVEL_FINISHED,
	ADD_MOVEMENT,
} from "client/user-interface/store/stats/types"
import DebugDisplayState from "."

const randomCall = (odds: number, callback: Callback) => {
	if (math.random() < odds) callback()
}

export = (story: GuiObject) => {
	const handle = mount(
		<Provider store={store}>
			<DebugDisplayState />
		</Provider>,
		story
	)

	let running = true
	task.delay(1, () => {
		while (running) {
			randomCall(0.5, () => store.dispatch({ type: TOGGLE_DISPLAY_KEYS_PRESSED }))
			randomCall(0.5, () => store.dispatch({ type: TOGGLE_DISPLAY_STATE }))
			randomCall(0.5, () => store.dispatch({ type: ADD_DEATH }))
			randomCall(0.5, () => store.dispatch({ type: ADD_BUTTON_PRESSED }))
			randomCall(0.5, () => store.dispatch({ type: ADD_LEVEL_FINISHED }))
			randomCall(0.5, () => store.dispatch({ type: ADD_MOVEMENT }))
			task.wait(1)
		}
	})

	return () => {
		unmount(handle)
		running = false
	}
}

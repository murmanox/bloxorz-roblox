import { createReducer } from "@rbxts/rodux"
import { DebugActions } from "./actions"
import { DebugState, TOGGLE_DISPLAY_KEYS_PRESSED, TOGGLE_DISPLAY_STATE } from "./types"

const initial_state: DebugState = { display_keys_pressed: false, display_state: false }

const debugReducer = createReducer<DebugState, DebugActions>(initial_state, {
	[TOGGLE_DISPLAY_KEYS_PRESSED]: (state) => {
		return { ...state, display_keys_pressed: !state.display_keys_pressed }
	},
	[TOGGLE_DISPLAY_STATE]: (state) => {
		return { ...state, display_state: !state.display_state }
	},
})

export default debugReducer

import Rodux from "@rbxts/rodux"
import { GameMenuActions, GameMenuStates, SET_MENU } from "./types"

export interface GameMenuState {
	menu: GameMenuStates
}

const initial_state: GameMenuState = {
	menu: "main",
}

const reducer = Rodux.createReducer<GameMenuState, GameMenuActions>(initial_state, {
	[SET_MENU]: (state, action) => {
		return { ...state, menu: action.menu }
	},
})

export default reducer

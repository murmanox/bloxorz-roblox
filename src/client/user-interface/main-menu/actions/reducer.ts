import Rodux from "@rbxts/rodux"
import { MainMenuActions, MainMenuStates, SET_MENU } from "./types"

export interface MainMenuState {
	menu: MainMenuStates
}

const initial_state: MainMenuState = {
	menu: "none",
}

const reducer = Rodux.createReducer<MainMenuState, MainMenuActions>(initial_state, {
	[SET_MENU]: (state, action) => {
		const menu: MainMenuStates = action.menu === state.menu ? "none" : action.menu
		return { ...state, menu }
	},
})

export default reducer

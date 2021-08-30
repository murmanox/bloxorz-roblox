import Rodux from "@rbxts/rodux"
import { MenuActions, MenuStates, SET_MENU } from "./types"

export interface MenuState {
	menu: MenuStates
}

const initial_state: MenuState = {
	menu: "main menu",
}

const reducer = Rodux.createReducer<MenuState, MenuActions>(initial_state, {
	[SET_MENU]: (state, action) => {
		return { ...state, menu: action.menu }
	},
})

export default reducer

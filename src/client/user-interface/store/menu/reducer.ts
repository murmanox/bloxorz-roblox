import Rodux from "@rbxts/rodux"
import { ActionSetMenu } from "./actions"
import { MenuState, MenuStates, SET_MENU } from "./types"

export type MenuActions = ActionSetMenu

const initial_state: MenuState = {
	page: "none",
}

const menuReducer = Rodux.createReducer<MenuState, MenuActions>(initial_state, {
	[SET_MENU]: (state, action) => {
		const page: MenuStates = action.page === state.page ? "none" : action.page
		return { ...state, page }
	},
})

export default menuReducer

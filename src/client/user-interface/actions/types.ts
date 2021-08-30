import Rodux from "@rbxts/rodux"

export const SET_MENU = "menu/set_menu"
export interface SetMenuAction extends Rodux.Action {
	type: typeof SET_MENU
	menu: MenuStates
}

export type MenuActions = SetMenuAction
export type MenuStates = "main menu" | "game"

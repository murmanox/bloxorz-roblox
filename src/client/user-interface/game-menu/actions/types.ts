import Rodux from "@rbxts/rodux"

export const SET_MENU = "game_menu/set_menu"
export interface SetMenuAction extends Rodux.Action {
	type: typeof SET_MENU
	menu: GameMenuStates
}

export type GameMenuActions = SetMenuAction
export type GameMenuStates = "main" | "play"

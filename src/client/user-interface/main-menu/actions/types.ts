import Rodux from "@rbxts/rodux"

export const SET_MENU = "main_menu/set_menu"
export interface SetMenuAction extends Rodux.Action {
	type: typeof SET_MENU
	menu: MainMenuStates
}

export type MainMenuActions = SetMenuAction
export type MainMenuStates =
	| "level select"
	| "stats"
	| "settings"
	| "updates"
	| "credits"
	| "none"
	| "play"

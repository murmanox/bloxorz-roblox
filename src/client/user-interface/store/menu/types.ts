export interface MenuState {
	page: MenuStates
}

export const SET_MENU = "main_menu/set_menu"

export type MenuStates =
	| "level select"
	| "stats"
	| "settings"
	| "updates"
	| "credits"
	| "none"
	| "play"

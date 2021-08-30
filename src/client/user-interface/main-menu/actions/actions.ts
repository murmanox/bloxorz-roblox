import { MainMenuStates, SetMenuAction, SET_MENU } from "./types"

export const setMenu = (menu: MainMenuStates): SetMenuAction => ({
	type: SET_MENU,
	menu,
})

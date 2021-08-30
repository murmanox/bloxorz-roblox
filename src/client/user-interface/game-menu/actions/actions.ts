import { GameMenuStates, SetMenuAction, SET_MENU } from "./types"

export const setMenu = (menu: GameMenuStates): SetMenuAction => ({
	type: SET_MENU,
	menu,
})

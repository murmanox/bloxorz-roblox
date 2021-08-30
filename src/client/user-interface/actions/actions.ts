import { MenuStates, SetMenuAction, SET_MENU } from "./types"

export const setMenu = (menu: MenuStates): SetMenuAction => ({
	type: SET_MENU,
	menu,
})

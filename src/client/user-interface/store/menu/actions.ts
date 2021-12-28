import { Action } from "@rbxts/rodux"
import { MenuStates, SET_MENU } from "./types"

export interface ActionSetMenu extends Action<typeof SET_MENU> {
	page: MenuStates
}

export type MainActions = ActionSetMenu

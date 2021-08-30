import Rodux from "@rbxts/rodux"
import GameMenuReducer from "client/user-interface/game-menu/actions/reducer"
import MainMenuReducer from "client/user-interface/main-menu/actions/reducer"
import { MovementReducer } from "client/user-interface/top-bar/rodux/movement-reducer"

export type InterfaceState = StateFromReducer<typeof InterfaceReducer>
export type InterfaceActions = ActionsFromReducer<typeof InterfaceReducer>
type StateFromReducer<T extends Rodux.Reducer<any, any>> = T extends Rodux.Reducer<
	infer S,
	Rodux.AnyAction
>
	? S
	: T
type ActionsFromReducer<T extends Rodux.Reducer<any, any>> = T extends Rodux.Reducer<any, infer A>
	? A
	: T

const InterfaceReducer = Rodux.combineReducers({
	game_menu: GameMenuReducer,
	main_menu: MainMenuReducer,
	test: MovementReducer,
})

export default InterfaceReducer

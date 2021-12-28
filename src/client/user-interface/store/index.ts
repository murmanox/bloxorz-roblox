import { combineReducers, Store } from "@rbxts/rodux"
import { DebugActions } from "./debug/actions"
import debugReducer from "./debug/reducer"
import { DebugState } from "./debug/types"
import { GameActions } from "./game/actions"
import gameReducer from "./game/reducer"
import { GameState } from "./game/types"
import menuReducer, { MenuActions } from "./menu/reducer"
import { MenuState } from "./menu/types"
import { PlayerStatsActions } from "./stats/actions"
import { statsReducer } from "./stats/reducer"
import { PlayerStatsState } from "./stats/types"

export interface AppState {
	debug: DebugState
	stats: PlayerStatsState
	menu: MenuState
	game: GameState
}

type AppActions = DebugActions | PlayerStatsActions | MenuActions | GameActions

const reducer = combineReducers({
	debug: debugReducer,
	stats: statsReducer,
	menu: menuReducer,
	game: gameReducer,
})

export const store = new Store<AppState, AppActions>(reducer)

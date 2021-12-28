import Rodux from "@rbxts/rodux"
import {
	ADD_GAME_MOVEMENT,
	RESET_GAME_MOVEMENT,
	SET_CHECKPOINT,
	SET_PAUSE,
	START_GAME,
	STOP_GAME,
} from "./types"

interface ActionStartGame extends Rodux.Action<typeof START_GAME> {
	level?: number
}
interface ActionStopGame extends Rodux.Action<typeof STOP_GAME> {}
interface ActionSetPause extends Rodux.Action<typeof SET_PAUSE> {
	paused: boolean
}

interface ActionAddGameMovement extends Rodux.Action<typeof ADD_GAME_MOVEMENT> {}
interface ActionResetGameMovement extends Rodux.Action<typeof RESET_GAME_MOVEMENT> {}
interface ActionSetCheckpoint extends Rodux.Action<typeof SET_CHECKPOINT> {}

export type GameActions =
	| ActionStartGame
	| ActionStopGame
	| ActionSetPause
	| ActionAddGameMovement
	| ActionResetGameMovement
	| ActionSetCheckpoint

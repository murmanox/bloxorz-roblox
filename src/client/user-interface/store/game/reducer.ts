import { createReducer } from "@rbxts/rodux"
import { GameActions } from "./actions"
import {
	ADD_GAME_MOVEMENT,
	GameState,
	RESET_GAME_MOVEMENT,
	SET_CHECKPOINT,
	SET_PAUSE,
	START_GAME,
	STOP_GAME,
} from "./types"

const initial_state: GameState = {
	running: false,
	paused: false,
	movements: 0,
	checkpoint: 0,
	level: 0,
}

const gameReducer = createReducer<GameState, GameActions>(initial_state, {
	[START_GAME]: (state, action) => ({
		...state,
		running: true,
		level: action.level ?? state.level,
	}),
	[STOP_GAME]: (state) => ({ ...state, running: false, paused: false, movements: 0 }),
	[SET_PAUSE]: (state, { paused }) => ({ ...state, paused }),
	[ADD_GAME_MOVEMENT]: (state) => ({ ...state, movements: state.movements + 1 }),
	[RESET_GAME_MOVEMENT]: (state) => ({ ...state, movements: state.checkpoint }),
	[SET_CHECKPOINT]: (state) => ({ ...state, checkpoint: state.movements }),
})

export default gameReducer

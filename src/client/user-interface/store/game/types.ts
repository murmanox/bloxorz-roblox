export interface GameState {
	running: boolean
	paused: boolean
	movements: number
	checkpoint: number
	level: number
}

// Types for starting and stopping the game
export const START_GAME = "game/start_game"
export const STOP_GAME = "game/stop_game"

// Types for setting and resetting movement counter
export const ADD_GAME_MOVEMENT = "game/add_movement"
export const RESET_GAME_MOVEMENT = "game/reset_movement"
export const SET_CHECKPOINT = "game/set_checkpoint"

export const SET_PAUSE = "game/set_pause"

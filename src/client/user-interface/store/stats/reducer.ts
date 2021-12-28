import Rodux from "@rbxts/rodux"
import { PlayerStatsActions } from "./actions"
import {
	ADD_BUTTON_PRESSED,
	ADD_DEATH,
	ADD_LEVEL_FINISHED,
	ADD_MOVEMENT,
	ADD_TELEPORT,
	ADD_TILE_BROKEN,
	ADD_TIME_PLAYED,
	PlayerStatsState,
} from "./types"

const intitial_state: PlayerStatsState = {
	total_time_played: 0,
	total_deaths: 0,
	total_movement: 0,
	total_levels_finished: 0,
	total_teleports: 0,
	total_buttons_pressed: 0,
	total_tiles_broken: 0,
}

function incrementCounter(name: keyof PlayerStatsState) {
	return (state: PlayerStatsState): PlayerStatsState => {
		return { ...state, [name]: state[name] + 1 }
	}
}

export const statsReducer = Rodux.createReducer<PlayerStatsState, PlayerStatsActions>(
	intitial_state,
	{
		[ADD_TIME_PLAYED]: (state, action) => {
			const new_state = { ...state }
			new_state.total_time_played += action.seconds
			return new_state
		},
		[ADD_DEATH]: incrementCounter("total_deaths"),
		[ADD_MOVEMENT]: incrementCounter("total_movement"),
		[ADD_LEVEL_FINISHED]: incrementCounter("total_levels_finished"),
		[ADD_TELEPORT]: incrementCounter("total_teleports"),
		[ADD_BUTTON_PRESSED]: incrementCounter("total_buttons_pressed"),
		[ADD_TILE_BROKEN]: incrementCounter("total_tiles_broken"),
	}
)

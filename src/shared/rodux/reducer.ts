import Rodux from "@rbxts/rodux"
import { ActionTypes } from "./actions"

export interface PlayerStoreState {
	total_time_played: number
	total_deaths: number
	total_movement: number
	total_levels_finished: number
	total_teleports: number
	total_buttons_pressed: number
	total_tiles_broken: number
}

const intitial_state: PlayerStoreState = {
	total_time_played: 0,
	total_deaths: 0,
	total_movement: 0,
	total_levels_finished: 0,
	total_teleports: 0,
	total_buttons_pressed: 0,
	total_tiles_broken: 0,
}

function incrementCounter(name: keyof PlayerStoreState) {
	return (state: PlayerStoreState, action: ActionTypes): PlayerStoreState => {
		const new_state = { ...state }
		new_state[name] += 1
		print(`Incrementing ${name} from ${state[name]} to ${new_state[name]}`)
		return new_state
	}
}

export const reducer = Rodux.createReducer<PlayerStoreState, ActionTypes>(intitial_state, {
	AddTimePlayed: (state, action) => {
		const new_state = { ...state }
		new_state.total_time_played += action.seconds
		return new_state
	},
	AddDeath: incrementCounter("total_deaths"),
	AddMovement: incrementCounter("total_movement"),
	AddLevelFinished: incrementCounter("total_levels_finished"),
	AddTeleport: incrementCounter("total_teleports"),
	AddButtonPressed: incrementCounter("total_buttons_pressed"),
	AddTileBroken: incrementCounter("total_tiles_broken"),
})

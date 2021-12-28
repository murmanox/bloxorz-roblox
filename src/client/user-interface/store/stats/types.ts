export interface PlayerStatsState {
	total_time_played: number
	total_deaths: number
	total_movement: number
	total_levels_finished: number
	total_teleports: number
	total_buttons_pressed: number
	total_tiles_broken: number
}

export const ADD_TIME_PLAYED = "stats/add_time_played"
export const ADD_MOVEMENT = "stats/add_movement"
export const ADD_DEATH = "stats/add_death"
export const ADD_LEVEL_FINISHED = "stats/add_level_finished"
export const ADD_TELEPORT = "stats/add_teleport"
export const ADD_BUTTON_PRESSED = "stats/add_button_pressed"
export const ADD_TILE_BROKEN = "stats/add_tile_broken"

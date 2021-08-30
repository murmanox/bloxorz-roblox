import Rodux from "@rbxts/rodux"
import { TMovementActions } from "./movement-actions"

export interface MovementState {
	current_movements: number
	checkpoint: number
}

const intitial_state: MovementState = {
	current_movements: 0,
	checkpoint: 0,
}

export const MovementReducer = Rodux.createReducer<MovementState, TMovementActions>(
	intitial_state,
	{
		AddMovement: (state, action) => {
			return { ...state, current_movements: state.current_movements + 1 }
		},

		SetCheckpoint: (state, action) => {
			return { ...state, checkpoint: action.value }
		},

		SetMovements: (state, action) => {
			return { ...state, current_movements: state.checkpoint }
		},
	}
)

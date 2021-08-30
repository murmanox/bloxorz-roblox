import Rodux from "@rbxts/rodux"
import { TMovementActions } from "./movement-actions"
import { MovementState, MovementReducer } from "./movement-reducer"

export const MovementStore = new Rodux.Store<MovementState, TMovementActions>(
	MovementReducer,
	undefined
)

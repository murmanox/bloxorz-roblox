import Rodux from "@rbxts/rodux"

export const MovementActions = {
	addMovement: Rodux.makeActionCreator("AddMovement", () => ({})),
	setMovements: Rodux.makeActionCreator("SetMovements", () => ({})),
	setCheckpoint: Rodux.makeActionCreator("SetCheckpoint", (value: number) => ({
		value,
	})),
}

export type TMovementActions = ReturnType<typeof MovementActions[keyof typeof MovementActions]>

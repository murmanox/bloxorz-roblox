import Rodux from "@rbxts/rodux"

interface AddTimePlayedAction extends Rodux.Action<"AddTimePlayed"> {
	seconds: number
}

interface AddMovementAction extends Rodux.Action<"AddMovement"> {}
interface AddDeathAction extends Rodux.Action<"AddDeath"> {}
interface AddLevelFinishedAction extends Rodux.Action<"AddLevelFinished"> {}
interface AddTeleportAction extends Rodux.Action<"AddTeleport"> {}
interface AddButtonPressedAction extends Rodux.Action<"AddButtonPressed"> {}
interface AddTileBrokenAction extends Rodux.Action<"AddTileBroken"> {}

// This is a MASSIVE chore.
export const Actions = {
	addTimePlayed: (seconds: number): AddTimePlayedAction => ({
		type: "AddTimePlayed",
		seconds: seconds,
	}),
	addDeath: (): AddDeathAction => ({
		type: "AddDeath",
	}),
	addMovement: (): AddMovementAction => ({
		type: "AddMovement",
	}),
	addLevelFinished: (): AddLevelFinishedAction => ({
		type: "AddLevelFinished",
	}),
	addTeleport: (): AddTeleportAction => ({
		type: "AddTeleport",
	}),
	addButtonPressed: (): AddButtonPressedAction => ({
		type: "AddButtonPressed",
	}),
	addTileBroken: (): AddTileBrokenAction => ({
		type: "AddTileBroken",
	}),
}

export type ActionTypes = ReturnType<typeof Actions[keyof typeof Actions]>

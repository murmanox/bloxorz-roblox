import Rodux from "@rbxts/rodux"
import {
	ADD_BUTTON_PRESSED,
	ADD_DEATH,
	ADD_LEVEL_FINISHED,
	ADD_MOVEMENT,
	ADD_TELEPORT,
	ADD_TILE_BROKEN,
	ADD_TIME_PLAYED,
} from "./types"

interface ActionAddTimePlayed extends Rodux.Action<typeof ADD_TIME_PLAYED> {
	seconds: number
}
interface ActionAddMovement extends Rodux.Action<typeof ADD_MOVEMENT> {}
interface ActionAddDeath extends Rodux.Action<typeof ADD_DEATH> {}
interface ActionAddLevelFinished extends Rodux.Action<typeof ADD_LEVEL_FINISHED> {}
interface ActionAddTeleport extends Rodux.Action<typeof ADD_TELEPORT> {}
interface ActionAddButtonPressed extends Rodux.Action<typeof ADD_BUTTON_PRESSED> {}
interface ActionAddTileBroken extends Rodux.Action<typeof ADD_TILE_BROKEN> {}

export type PlayerStatsActions =
	| ActionAddTimePlayed
	| ActionAddMovement
	| ActionAddDeath
	| ActionAddLevelFinished
	| ActionAddTeleport
	| ActionAddButtonPressed
	| ActionAddTileBroken

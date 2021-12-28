import Rodux from "@rbxts/rodux"
import { TOGGLE_DISPLAY_KEYS_PRESSED, TOGGLE_DISPLAY_STATE } from "./types"

interface ActionToggleDisplayKeysPressed extends Rodux.Action<typeof TOGGLE_DISPLAY_KEYS_PRESSED> {}
interface ActionToggleDisplayState extends Rodux.Action<typeof TOGGLE_DISPLAY_STATE> {}

export type DebugActions = ActionToggleDisplayKeysPressed | ActionToggleDisplayState

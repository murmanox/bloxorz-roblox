import Rodux from "@rbxts/rodux"
import { ActionTypes as Actions } from "./actions"
import { PlayerStoreState as State, reducer } from "./reducer"

const PlayerStore = new Rodux.Store<State, Actions>(reducer)
export default PlayerStore

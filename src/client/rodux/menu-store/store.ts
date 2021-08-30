import Rodux from "@rbxts/rodux"
import InterfaceReducer from "./reducer"

const InterfaceStore = new Rodux.Store(InterfaceReducer, undefined)
export default InterfaceStore

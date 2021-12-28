import Roact from "@rbxts/roact"
import { hooked } from "@rbxts/roact-hooked"
import { useSelector } from "@rbxts/roact-rodux-hooked"
import { AppState } from "client/user-interface/store"
import DebugControls from "./components/controls"
import DebugDisplayState from "./components/display-state"

interface Props {}

const Debug = hooked<Props>((props) => {
	const debug = useSelector((state: AppState) => state.debug)

	return (
		<>
			{debug.display_keys_pressed && <DebugControls />}
			{debug.display_state && <DebugDisplayState />}
		</>
	)
})

export default Debug

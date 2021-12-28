import inspect from "@rbxts/inspect"
import Roact from "@rbxts/roact"
import { hooked } from "@rbxts/roact-hooked"
import { useSelector } from "@rbxts/roact-rodux-hooked"
import { AppState } from "client/user-interface/store"

interface Props {}

const DebugDisplayState = hooked<Props>((props) => {
	const state = useSelector((state: AppState) => state)

	return (
		<textlabel
			Size={UDim2.fromScale(1, 1)}
			Text={inspect(state)}
			BackgroundTransparency={1}
			TextColor3={new Color3(0.95, 0.95, 0.95)}
			TextXAlignment={Enum.TextXAlignment.Left}
			TextYAlignment={Enum.TextYAlignment.Top}
		/>
	)
})

export default DebugDisplayState

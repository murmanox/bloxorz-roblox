import Roact from "@rbxts/roact"
import { hooked, useState } from "@rbxts/roact-hooked"
import { UserInputService } from "@rbxts/services"
import useKeyboard from "client/user-interface/hooks/use-keyboard"

interface Props {
	Position?: UDim2 | Roact.Binding<UDim2>
	VerticalAlignment?: Enum.VerticalAlignment
}

const DebugControls = hooked<Props>((props) => {
	const { Position = UDim2.fromScale(0, 1), VerticalAlignment = Enum.VerticalAlignment.Bottom } =
		props

	const [keys, setKeys] = useState<InputObject[]>([])

	useKeyboard(() => {
		setKeys(UserInputService.GetKeysPressed())
	})

	return (
		<frame Size={new UDim2(0, 100, 0, 0)} Position={Position}>
			<uilistlayout VerticalAlignment={VerticalAlignment} />
			{keys.map((input) => (
				<textlabel
					Text={input.KeyCode.Name}
					Size={new UDim2(1, 0, 0, 25)}
					FontSize={Enum.FontSize.Size12}
				/>
			))}
		</frame>
	)
})

export default DebugControls

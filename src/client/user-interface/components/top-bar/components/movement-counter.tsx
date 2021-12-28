import Roact from "@rbxts/roact"
import { hooked, useContext } from "@rbxts/roact-hooked"
import ThemedTextLabel from "client/user-interface/components/common/themed-text-label"
import { FontContext, FontProvider } from "client/user-interface/context/font-context"

// each letter is 16 pixels wide with Size32, this makes min size 2 letters wide
const MIN_VALUE_LABEL_WIDTH = 32

const HorizontalLayout = (props: Roact.JsxInstance<UIListLayout>) => (
	<uilistlayout
		{...props}
		FillDirection={Enum.FillDirection.Horizontal}
		HorizontalAlignment={Enum.HorizontalAlignment.Right}
	/>
)

interface Props {
	value: number
}

const MovementCounter = hooked<Props>((props) => {
	const font = useContext(FontContext)
	return (
		<frame Transparency={1} AutomaticSize={Enum.AutomaticSize.X} Size={UDim2.fromScale(0, 1)}>
			<HorizontalLayout Padding={new UDim(0, 5)} />
			<ThemedTextLabel
				Key="moves_value"
				Size={new UDim2(0, MIN_VALUE_LABEL_WIDTH, 1, 0)}
				Text={`${props.value}`}
				TextXAlignment={Enum.TextXAlignment.Right}
				BackgroundTransparency={1}
				FontSize={Enum.FontSize.Size32}
				AutomaticSize={Enum.AutomaticSize.X}
				{...font}
			/>
			<ThemedTextLabel
				Key="moves_text"
				Text={"MOVES:"}
				Size={UDim2.fromScale(0, 1)}
				BackgroundTransparency={1}
				FontSize={Enum.FontSize.Size32}
				AutomaticSize={Enum.AutomaticSize.X}
			/>
		</frame>
	)
})

export default MovementCounter

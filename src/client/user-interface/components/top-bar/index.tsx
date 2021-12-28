import Roact from "@rbxts/roact"
import { hooked } from "@rbxts/roact-hooked"
import { useSelector } from "@rbxts/roact-rodux-hooked"
import InOutSpringyFrame from "client/user-interface/components/common/in-out-springy-frame"
import { AppState } from "client/user-interface/store"
import MovementCounter from "./components/movement-counter"

const SIZE = new UDim2(1, 0, 0, 36)
const IN = new UDim2(0, 0, 0, 0)
const OUT = new UDim2(0, 0, 0, -SIZE.Y.Offset)

const HorizontalLayout = (props: Roact.JsxInstance<UIListLayout>) => (
	<uilistlayout
		{...props}
		FillDirection={Enum.FillDirection.Horizontal}
		HorizontalAlignment={Enum.HorizontalAlignment.Right}
	/>
)

interface Props {
	visible?: boolean
}

const TopBar = hooked<Props>((props) => {
	const running = useSelector((state: AppState) => state.game.running)
	const moves = useSelector((state: AppState) => state.game.movements)

	return (
		<InOutSpringyFrame
			In={IN}
			Out={OUT}
			Visible={running || !!props.visible}
			native={{
				BorderSizePixel: 0,
				Transparency: 0.75,
				BackgroundColor3: new Color3(0, 0, 0),
				Size: SIZE,
			}}
		>
			<uistroke Thickness={2} Transparency={0.5} />
			<frame
				Key="moves"
				Position={UDim2.fromScale(1, 0)}
				AnchorPoint={new Vector2(1, 0)}
				Size={UDim2.fromScale(1, 1)}
				BackgroundTransparency={1}
			>
				<HorizontalLayout />
				<uipadding PaddingRight={new UDim(0, 5)} />
				<MovementCounter value={moves} />
			</frame>
		</InOutSpringyFrame>
	)
})

export default TopBar

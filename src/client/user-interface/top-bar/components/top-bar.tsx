import Roact from "@rbxts/roact"
import RoactRodux from "@rbxts/roact-rodux"
import { InterfaceState } from "client/rodux/menu-store/reducer"
import { MenuState } from "client/user-interface/actions/reducer"
import InOutSpringyFrame from "client/user-interface/common/components/in-out-springy-frame"
import { GameMenuStates } from "client/user-interface/game-menu/actions/types"
import { MovementState } from "../rodux/movement-reducer"
import MovementCounter from "./movement-counter"

const SIZE = new UDim2(1, 0, 0, 34)
const IN = new UDim2(0, 0, 0, 0)
const OUT = new UDim2(0, 0, 0, -SIZE.Y.Offset)

const HorizontalLayout = (props: Roact.JsxInstance<UIListLayout>) => (
	<uilistlayout
		{...props}
		FillDirection={Enum.FillDirection.Horizontal}
		HorizontalAlignment={Enum.HorizontalAlignment.Right}
	/>
)

// const mapStateToProps = (state: MovementState) => {
// 	return { moves: state.current_movements }
// }
const mapStateToProps = (state: InterfaceState) => {
	return { visible: state.game_menu.menu === "play", moves: state.test.current_movements }
}

interface Props {
	visible: boolean
	moves: number
}

export const TopBar = RoactRodux.connect(mapStateToProps)((props: Props) => {
	return (
		<InOutSpringyFrame
			In={IN}
			Out={OUT}
			Visible={props.visible}
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
				<MovementCounter value={props.moves} />
			</frame>
		</InOutSpringyFrame>
	)
})

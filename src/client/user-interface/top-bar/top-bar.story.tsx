import Roact from "@rbxts/roact"
import { StoreProvider } from "@rbxts/roact-rodux"
import { UserInputService } from "@rbxts/services"
import SpringyFrame from "client/user-interface/common/components/springy-frame"
import { TopBar } from "client/user-interface/top-bar/components/top-bar"
import { MovementActions } from "client/user-interface/top-bar/rodux/movement-actions"
import { MovementStore } from "client/user-interface/top-bar/rodux/movement-store"

const background_gradients = [
	new ColorSequence(new Color3(0.85), new Color3(0.2)),
	new ColorSequence(new Color3(0.85, 0.85, 0.85), new Color3(0.2, 0.2, 0.2)),
]

interface Props {}
interface State {
	visible: boolean
}

class GameGui extends Roact.PureComponent<Props, State> {
	state = { visible: true }

	render(): Roact.Element | undefined {
		return (
			<>
				<SpringyFrame
					Size={new UDim2(1, 0, 0, 0)}
					StartPosition={new UDim2(0, 0, 0, -36)}
					GoalPosition={new UDim2(0, 0, 0, this.state.visible ? 0 : -36)}
				>
					<StoreProvider store={MovementStore}>
						<TopBar />
					</StoreProvider>
				</SpringyFrame>
				<textbutton
					AnchorPoint={new Vector2(0, 1)}
					Size={UDim2.fromOffset(100, 50)}
					Position={new UDim2(0, 0, 1, 0)}
					Event={{
						Activated: (rbx) => {
							this.setState({
								visible: !this.state.visible,
							})
						},
					}}
				/>
			</>
		)
	}
}

export = (preview_frame: GuiObject) => {
	const random_gradient = background_gradients[math.random(0, background_gradients.size() - 1)]
	const element = (
		<frame Size={UDim2.fromScale(1, 1)}>
			<uigradient Color={random_gradient} Rotation={90} />
			{/* <uilistlayout SortOrder={Enum.SortOrder.LayoutOrder} /> */}
			{/* <StoreProvider store={MovementStore}>
				<TopBar />
			</StoreProvider> */}
			<GameGui />
		</frame>
	)
	const handle = Roact.mount(element, preview_frame)

	const c = UserInputService.InputBegan.Connect((input) => {
		if (input.KeyCode === Enum.KeyCode.One) {
			MovementStore.dispatch(MovementActions.addMovement())
		}

		if (input.KeyCode === Enum.KeyCode.Two) {
			MovementStore.dispatch(
				MovementActions.setCheckpoint(MovementStore.getState().current_movements)
			)
		}

		if (input.KeyCode === Enum.KeyCode.Three) {
			MovementStore.dispatch(MovementActions.setMovements())
		}
	})

	return () => {
		Roact.unmount(handle)
		c.Disconnect()
	}
}

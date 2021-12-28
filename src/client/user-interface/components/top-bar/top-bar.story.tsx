import Maid from "@rbxts/maid"
import Roact from "@rbxts/roact"
import { hooked, useState } from "@rbxts/roact-hooked"
import { Provider } from "@rbxts/roact-rodux-hooked"
import { UserInputService } from "@rbxts/services"
import TopBar from "client/user-interface/components/top-bar"
import { FontProvider } from "client/user-interface/context/font-context"
import { store } from "client/user-interface/store"
import {
	ADD_GAME_MOVEMENT,
	RESET_GAME_MOVEMENT,
	SET_CHECKPOINT,
} from "client/user-interface/store/game/types"

const background_gradients = [
	new ColorSequence(new Color3(0.85), new Color3(0.2)),
	new ColorSequence(new Color3(0.85, 0.85, 0.85), new Color3(0.2, 0.2, 0.2)),
]

interface Props {}

const GameGui = hooked<Props>((props) => {
	const [visible, setVisible] = useState(true)

	return (
		<>
			<Provider store={store}>
				<FontProvider>
					<TopBar visible={visible} />
				</FontProvider>
			</Provider>
			<textbutton
				AnchorPoint={new Vector2(0, 1)}
				Size={UDim2.fromOffset(100, 50)}
				Position={new UDim2(0, 0, 1, 0)}
				Event={{
					Activated: (rbx) => setVisible(!visible),
				}}
			/>
		</>
	)
})
export = (preview_frame: GuiObject) => {
	const maid = new Maid()

	const random_gradient = background_gradients[math.random(0, background_gradients.size() - 1)]
	const element = (
		<frame Size={UDim2.fromScale(1, 1)}>
			<uigradient Color={random_gradient} Rotation={90} />
			<GameGui />
		</frame>
	)
	const handle = Roact.mount(element, preview_frame)

	maid.GiveTask(
		UserInputService.InputBegan.Connect((input) => {
			if (input.KeyCode === Enum.KeyCode.One) {
				store.dispatch({ type: ADD_GAME_MOVEMENT })
			}

			if (input.KeyCode === Enum.KeyCode.Two) {
				store.dispatch({ type: SET_CHECKPOINT })
			}

			if (input.KeyCode === Enum.KeyCode.Three) {
				store.dispatch({ type: RESET_GAME_MOVEMENT })
			}
		})
	)

	return () => {
		Roact.unmount(handle)
		maid.DoCleaning()
	}
}

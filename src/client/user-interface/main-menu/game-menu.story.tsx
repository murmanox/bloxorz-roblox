import Roact from "@rbxts/roact"
import { StoreProvider } from "@rbxts/roact-rodux"
import { UserInputService } from "@rbxts/services"
import MainMenu from "client/components/main-menu/main-menu"
import InterfaceStore from "client/rodux/menu-store/store"
import { TopBar } from "client/user-interface/top-bar/components/top-bar"
import { MovementActions } from "client/user-interface/top-bar/rodux/movement-actions"
import { Actions } from "shared/rodux/actions"
import PlayerStore from "shared/rodux/store"

const background_gradients = [
	new ColorSequence(new Color3(0.85), new Color3(0.2)),
	new ColorSequence(new Color3(0.85, 0.85, 0.85), new Color3(0.2, 0.2, 0.2)),
]

export = (preview_frame: GuiObject) => {
	let running = true
	const random_gradient = background_gradients[math.random(0, background_gradients.size() - 1)]
	const element = (
		<frame Size={UDim2.fromScale(1, 1)}>
			<uigradient Color={random_gradient} Rotation={90} />
			<StoreProvider store={InterfaceStore}>
				<MainMenu />
				<TopBar />
			</StoreProvider>
		</frame>
	)
	const handle = Roact.mount(element, preview_frame)

	const c = UserInputService.InputBegan.Connect((input) => {
		if (input.KeyCode === Enum.KeyCode.One) {
			InterfaceStore.dispatch(MovementActions.addMovement())
		}

		if (input.KeyCode === Enum.KeyCode.Two) {
			InterfaceStore.dispatch(
				MovementActions.setCheckpoint(InterfaceStore.getState().test.current_movements)
			)
		}

		if (input.KeyCode === Enum.KeyCode.Three) {
			InterfaceStore.dispatch(MovementActions.setMovements())
		}
	})

	spawn(() => {
		while (running) {
			// increment time here
			wait(1)
			if (running) PlayerStore.dispatch(Actions.addTimePlayed(1))
		}
	})

	return () => {
		Roact.unmount(handle)
		c.Disconnect()
		running = false
	}
}

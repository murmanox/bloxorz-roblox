import Roact from "@rbxts/roact"
import { StoreProvider } from "@rbxts/roact-rodux"
import MainMenu from "client/components/main-menu/main-menu"
import InterfaceStore from "client/rodux/menu-store/store"
import { Actions } from "shared/rodux/actions"
import PlayerStore from "shared/rodux/store"

const background_gradients = [
	new ColorSequence(new Color3(0.85), new Color3(0.2)),
	new ColorSequence(new Color3(0.85, 0.85, 0.85), new Color3(0.2, 0.2, 0.2)),
]

export = (story: GuiBase2d) => {
	const random_gradient = background_gradients[math.random(0, background_gradients.size() - 1)]
	let running = true

	const element = (
		<frame Size={UDim2.fromScale(1, 1)}>
			<uigradient Color={random_gradient} Rotation={90} />
			<StoreProvider store={InterfaceStore}>
				<MainMenu/>
			</StoreProvider>
		</frame>
	)
	const handle = Roact.mount(element, story)

	spawn(() => {
		while (running) {
			// increment time here
			wait(1)
			if (running) PlayerStore.dispatch(Actions.addTimePlayed(1))
		}
	})

	return () => {
		running = false
		Roact.unmount(handle)
	}
}

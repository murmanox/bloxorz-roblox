import Roact from "@rbxts/roact"
import { StoreProvider } from "@rbxts/roact-rodux"
import { Provider } from "@rbxts/roact-rodux-hooked"
import MainMenu from "client/user-interface/components/main-menu"
import { FontProvider } from "client/user-interface/context/font-context"
import { store } from "client/user-interface/store"
import { ADD_TIME_PLAYED } from "client/user-interface/store/stats/types"

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
			<Provider store={store}>
				<FontProvider>
					<MainMenu />
				</FontProvider>
			</Provider>
		</frame>
	)
	const handle = Roact.mount(element, story)

	spawn(() => {
		while (running) {
			// increment time here
			wait(1)
			if (running) store.dispatch({ type: ADD_TIME_PLAYED, seconds: 1 })
		}
	})

	return () => {
		running = false
		Roact.unmount(handle)
	}
}

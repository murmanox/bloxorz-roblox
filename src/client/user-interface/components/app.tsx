import Roact from "@rbxts/roact"
import { hooked } from "@rbxts/roact-hooked"
import { Provider, useSelector } from "@rbxts/roact-rodux-hooked"
import MainMenu from "client/user-interface/components/main-menu"
import { FontProvider } from "../context/font-context"
import { AppState, store } from "../store"
import { STOP_GAME } from "../store/game/types"
import Debug from "./debug"
import TopBar from "./top-bar"

const Stop = hooked(() => {
	const running = useSelector((state: AppState) => state.game.running)

	return (
		<textbutton
			Text={"stop game"}
			AnchorPoint={new Vector2(1, 1)}
			Position={UDim2.fromScale(1, 1)}
			Size={UDim2.fromOffset(65, 18)}
			Transparency={running ? 0 : 1}
			Event={{ Activated: () => store.dispatch({ type: STOP_GAME }) }}
		/>
	)
})

const App = hooked(() => {
	return (
		<Provider store={store}>
			<FontProvider>
				<MainMenu />
				<TopBar />
				<Debug />
				<Stop />
			</FontProvider>
		</Provider>
	)
})

export default App

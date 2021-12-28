import { Janitor } from "@rbxts/janitor"
import Roact from "@rbxts/roact"
import { Players, StarterGui, Workspace } from "@rbxts/services"
import { BoardState } from "./player/game/board/board"
import { scaleCamera } from "./player/game/camera"
import { Game } from "./player/game/game"
import App from "./user-interface/components/app"
import { store } from "./user-interface/store"
import { ADD_TIME_PLAYED } from "./user-interface/store/stats/types"

//#region Interface

// since we don't load the player's character we have to manually copy StarterGui to PlayerGui
StarterGui.SetCoreGuiEnabled(Enum.CoreGuiType.All, false)
const player_gui = Players.LocalPlayer.WaitForChild("PlayerGui") as PlayerGui

// Initialise the UI and display it to the player
const element = (
	<screengui IgnoreGuiInset={true} ZIndexBehavior={Enum.ZIndexBehavior.Sibling}>
		<App />
	</screengui>
)

// I can probably improve this later
task.delay(1, () => {
	while (true) {
		store.dispatch({ type: ADD_TIME_PLAYED, seconds: 1 })
		wait(1)
	}
})

Roact.mount(element, player_gui)

//#endregion

const app = new Game()

// TODO: dispatch inside game class
// app.events.player.moved.connect(() => {
// 	// update local counter
// 	store.dispatch({ type: ADD_MOVEMENT })

// 	// tell server to update stats
// 	PlayerEvents.Moved.fireServer()
// })

interface JanitorProps {
	camera: RBXScriptConnection
}

const janitor = new Janitor<JanitorProps>()
app.board.onStateChange((state) => {
	if (state !== BoardState.Loading) return

	const [position, size] = [app.board.position, app.board.getSize()]
	scaleCamera(position, size)
	janitor.Add(
		Workspace.CurrentCamera!.GetPropertyChangedSignal("ViewportSize").Connect(() => {
			scaleCamera(position, size)
		}),
		"Disconnect",
		"camera"
	)
})

store.changed.connect((state, old_state) => {
	if (state.game.running && !old_state.game.running) {
		// start game
		const next_level = state.game.level !== old_state.game.level ? state.game.level : undefined
		app.startGame(next_level)
	}

	// check if game has been stopped
	if (!state.game.running && old_state.game.running) {
		// stop game
		app.stopGame()
	}
})

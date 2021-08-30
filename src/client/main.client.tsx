import { Players, StarterGui, Workspace } from "@rbxts/services"
import { Game } from "./player/game/game"
import { LevelData, levels } from "shared/level/level-config"
import { Janitor } from "@rbxts/janitor"
import { PlayerEvents } from "shared/config/network-events"
import Store from "shared/rodux/store"
import { Actions } from "shared/rodux/actions"
import Roact from "@rbxts/roact"
import PlayerStore from "shared/rodux/store"
import MainMenu from "./components/main-menu/main-menu"
import { StoreProvider } from "@rbxts/roact-rodux"
import InterfaceStore from "./rodux/menu-store/store"
import { TopBar } from "./user-interface/top-bar/components/top-bar"
import { MovementActions } from "./user-interface/top-bar/rodux/movement-actions"

// since we don't load the player's character we have to manually copy StarterGui to PlayerGui
StarterGui.SetCoreGuiEnabled(Enum.CoreGuiType.All, false)
const player_gui = Players.LocalPlayer.WaitForChild("PlayerGui") as PlayerGui

const app = new Game()
app.player_moved.Connect(() => {
	// update local counter
	Store.dispatch(Actions.addMovement())
	InterfaceStore.dispatch(MovementActions.addMovement())

	// tell server to update stats
	PlayerEvents.Moved.fireServer()
})

function scaleCamera(height: number, width: number) {
	// position camera relative to the board
	const camera = Workspace.CurrentCamera
	if (!camera) return

	const x = (width - 1) / 2
	const y = 0.5
	const z = (height - 1) / 2

	camera.CameraType = Enum.CameraType.Scriptable
	const look_at = new Vector3(x, y, z)
	const size = new Vector3(width, 0, height)

	// need to dynamically zoom camera based on screen and level size
	const cf = new CFrame(look_at.add(new Vector3(-0.27, 0.65, 1)), look_at)
	camera.FieldOfView = 1

	const screen_size = camera.ViewportSize.sub(new Vector2(0, 36)) // minus gui inset
	const board_ratio = math.max(1, width / height)
	const aspect_ratio = math.min(board_ratio, screen_size.X / screen_size.Y)
	const extents = size.div(2).Magnitude
	let distance = (extents * 1.2) / math.tan(math.rad(camera.FieldOfView / 2))

	distance *= 1.1
	distance /= aspect_ratio
	camera.CFrame = cf.mul(new CFrame(0, 0, distance))
}

interface JanitorProps {
	camera: RBXScriptConnection
}

const janitor = new Janitor<JanitorProps>()
app.level_loading.Connect((height, width) => {
	scaleCamera(height, width)
	janitor.Add(
		Workspace.CurrentCamera!.GetPropertyChangedSignal("ViewportSize").Connect(() => {
			scaleCamera(height, width)
		}),
		"Disconnect",
		"camera"
	)
})

function incrementLevel(index: number) {
	return [
		levels[index],
		() => {
			app.loadLevel(...incrementLevel(index + 1))
		},
	] as [LevelData, () => void]
}

// Initialise the UI and display it to the player
const element = (
	<screengui IgnoreGuiInset={true} ZIndexBehavior={Enum.ZIndexBehavior.Sibling}>
		<frame Size={UDim2.fromScale(1, 1)} Transparency={1}>
			<StoreProvider store={InterfaceStore}>
				<MainMenu />
				<TopBar />
			</StoreProvider>
		</frame>
	</screengui>
)

InterfaceStore.changed.connect((state, old_state) => {
	if (state.main_menu.menu !== old_state.main_menu.menu && state.main_menu.menu === "play") {
		delay(1, () => {
			const start_level = 0
			app.loadLevel(...incrementLevel(start_level))
		})
	}
})

spawn(() => {
	while (true) {
		wait(1)
		PlayerStore.dispatch(Actions.addTimePlayed(1))
	}
})

Roact.mount(element, player_gui)

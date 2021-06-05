import Make from "@rbxts/make"
import { Players, StarterGui, TweenService, Workspace } from "@rbxts/services"
import { Math } from "shared/utility/math"
import { Game } from "./player/game/Game"
import type { LevelData } from "shared/level/level-config"
import { Janitor } from "@rbxts/janitor"

const player_gui = Players.LocalPlayer.WaitForChild("PlayerGui") as PlayerGui
StarterGui.GetChildren().forEach((child) => {
	child.Clone().Parent = player_gui
})

StarterGui.SetCoreGuiEnabled(Enum.CoreGuiType.All, false)

const app = new Game()

function makePart(position: Vector3) {
	return Make("Part", {
		Size: new Vector3(0.1, 0.1, 0.1),
		Parent: Workspace,
		Position: position,
		Anchored: true,
		Color: new Color3(0, 1),
	})
}

function moveCamera(level_data: LevelData) {
	// position camera relative to the board
	const camera = Workspace.CurrentCamera
	if (camera === undefined) {
		return
	}

	const width = level_data.level_tiles[0].size()
	const height = level_data.level_tiles.size()

	const x = (width - 1) / 2
	const y = 0.5
	const z = (height - 1) / 2

	camera.CameraType = Enum.CameraType.Scriptable
	const look_at = new Vector3(x, y, z)

	// need to dynamically zoom camera based on screen and level size
	const cf = new CFrame(look_at.add(new Vector3(-0.27, 0.65, 1)), look_at)
	camera.FieldOfView = 1

	const part = janitor.Add(
		Make("Part", {
			Parent: Workspace,
			Size: new Vector3(width, 2.2, height),
			Position: new Vector3((width - 1) / 2, 0.4, (height - 1) / 2),
			Anchored: true,
			Transparency: 1,
			CanCollide: false,
		}),
		"Destroy",
		"part"
	)

	// const positions = [
	// 	part.Position.add(part.Size.div(2)),
	// 	part.Position.add(part.Size.div(2).mul(new Vector3(-1, 1, -1))),
	// 	part.Position.add(part.Size.div(2).mul(new Vector3(-1, -1, 1))),
	// 	part.Position.add(part.Size.div(2).mul(new Vector3(1, 1, -1))),
	// ]

	const screen_size = camera.ViewportSize.sub(new Vector2(0, 36))
	const part_ratio = math.max(1, part.Size.X / part.Size.Z)
	// const aspect_ratio = math.min(
	// 	math.max(screen_size.X / screen_size.Y, screen_size.Y / screen_size.X),
	// 	part_ratio * 0.85
	// )
	const aspect_ratio = math.min(part_ratio, screen_size.X / screen_size.Y)
	const extents = part.Size.div(2).Magnitude
	let distance = (extents * 1.2) / math.tan(math.rad(camera.FieldOfView / 2))

	distance *= 1.1
	distance /= aspect_ratio
	camera.CFrame = cf.mul(new CFrame(0, 0, distance))

	// print(
	// 	`Aspect Ratio: ${Math.roundTo(
	// 		aspect_ratio,
	// 		2
	// 	)}, Distance: ${distance}, Extents: ${extents}, Ratio: ${part_ratio}`
	// )
	print(distance)
}

interface JanitorProps {
	camera: RBXScriptConnection
	part: BasePart
	tween: Tween
}

const janitor = new Janitor<JanitorProps>()
app.board.loading.Connect((level) => {
	janitor.Cleanup()
	moveCamera(level)
	janitor.Add(
		Workspace.CurrentCamera!.GetPropertyChangedSignal("ViewportSize").Connect(() =>
			moveCamera(level)
		),
		"Disconnect",
		"camera"
	)
})

wait(1)
app.initialise()

function incrementLevel(index: number) {
	return [
		index + 1,
		(index: number) => {
			app.setLevel(...incrementLevel(index))
		},
	] as [number, () => void]
}

app.setLevel(0, (index) => {
	app.setLevel(...incrementLevel(index))
})

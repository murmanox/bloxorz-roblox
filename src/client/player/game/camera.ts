import { Workspace } from "@rbxts/services"

export function scaleCamera(position: Vector3, size: Vector2) {
	// position camera relative to the board
	const camera = Workspace.CurrentCamera
	if (!camera) return

	const x = (size.X - 1) / 2
	const y = 1
	const z = (size.Y - 1) / 2

	camera.CameraType = Enum.CameraType.Scriptable
	const look_at = new Vector3(x, y, z).add(position)

	// need to dynamically zoom camera based on screen and level size
	const cf = new CFrame(look_at.add(new Vector3(-0.27, 0.65, 1)), look_at)
	camera.FieldOfView = 1

	const screen_size = camera.ViewportSize.sub(new Vector2(0, 36)) // minus gui inset
	const board_ratio = math.max(1, size.X / size.Y)
	const aspect_ratio = math.min(board_ratio, screen_size.X / screen_size.Y)
	const extents = size.div(2).Magnitude
	let distance = (extents * 1.2) / math.tan(math.rad(camera.FieldOfView / 2))

	distance *= 1.1
	distance /= aspect_ratio
	camera.CFrame = cf.mul(new CFrame(0, 0, distance))
}

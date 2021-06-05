import Maid from "@rbxts/maid"
import flipper from "@rbxts/flipper"
import { RunService, UserInputService, Workspace } from "@rbxts/services"
import { settings } from "../settings/keybinds"

const DEBUG = false

enum Rotation {
	Standing,
	Left,
	Up,
}

interface Direction {
	Up: Vector3
	Down: Vector3
	Left: Vector3
	Right: Vector3
}

const Direction: Direction = {
	Up: new Vector3(0, 0, -1),
	Down: new Vector3(0, 0, 1),
	Left: new Vector3(-1, 0, 0),
	Right: new Vector3(1, 0, 0),
}

function makeDebugPart(pos: Vector3) {
	const part = new Instance("Part")
	part.Size = new Vector3(0.1, 0.1, 0.1)
	part.Position = pos
	part.Anchored = true

	part.Parent = Workspace
	return part
}

const player_model = new Instance("Part")
player_model.Size = new Vector3(1, 2, 1)
player_model.Position = new Vector3(0, 0 + player_model.Size.Y / 2, 0)
player_model.Anchored = true
player_model.Material = Enum.Material.CorrodedMetal
player_model.BrickColor = new BrickColor("CGA brown")
player_model.Parent = Workspace

const MAID_ROTATE = "rotate"
const MAID_DEBUG = "debug"

const rotation_time = 0.5

export class RotatingPlayer {
	private player_maid = new Maid()

	public rotation: Rotation
	public instance = player_model

	private is_rotating = false

	constructor() {
		this.rotation = Rotation.Standing
		this.player_maid.input = RunService.RenderStepped.Connect((dt) => {
			this.onUpdate(dt)
		})
	}

	/**
	 * Rotates the player 90 degrees on an axis around a rotation point
	 * @param direction The direction that the player is moving towards
	 */
	private rotate(direction: Vector3) {
		if (this.is_rotating) return
		this.is_rotating = true

		// get the size of the player on each axis, as if they were stretched instead of rotated
		let size = this.instance.Size
		size =
			this.rotation === Rotation.Standing
				? size
				: this.rotation === Rotation.Left
				? new Vector3(size.Y, size.X, size.Z)
				: new Vector3(size.X, size.Z, size.Y)

		// the offset to use in order to get from the player's position to the player's edge
		const half_size = size.div(2)
		let size_offset: Vector3
		if (direction.X) {
			size_offset = new Vector3(half_size.mul(direction.X).X, 0, 0)
		} else {
			size_offset = new Vector3(0, 0, half_size.mul(direction.Z).Z)
		}

		// the CFrame that the player is rotated around
		const rotation_point = new CFrame(
			this.instance.Position.add(new Vector3(size_offset.X, -half_size.Y, size_offset.Z))
		)

		if (DEBUG) {
			this.player_maid[MAID_DEBUG] = makeDebugPart(rotation_point.Position)
		}

		// the offset between the player's original CFrame and the rotation point
		const offset = rotation_point.Inverse().mul(this.instance.CFrame)
		let rotation = 0
		const rotation_speed = (1 / rotation_time) * 90
		this.player_maid[MAID_ROTATE] = RunService.RenderStepped.Connect((dt) => {
			// TODO: rotate using flipper for easing styles
			rotation = math.clamp(rotation + dt * rotation_speed, 0, 90)
			const rotate_direction = direction.mul(rotation)

			// rotate the CFrame and then move it to the rotation point using the offset
			const rotated_cframe = rotation_point.mul(
				CFrame.Angles(
					math.rad(rotate_direction.Z),
					math.rad(rotate_direction.Y),
					math.rad(-rotate_direction.X)
				)
			)
			this.instance.CFrame = rotated_cframe.mul(offset)

			if (rotation === 90) {
				this.player_maid[MAID_DEBUG] = undefined
				this.player_maid[MAID_ROTATE] = undefined
				this.is_rotating = false

				// this is pretty ugly, I'd like to refactor this if possible using instance.CFrame
				if (this.rotation === Rotation.Standing) {
					if (direction === Direction.Left || direction === Direction.Right) {
						this.rotation = Rotation.Left
					} else {
						this.rotation = Rotation.Up
					}
				} else if (this.rotation === Rotation.Left) {
					if (direction === Direction.Left || direction === Direction.Right) {
						this.rotation = Rotation.Standing
					}
				} else if (this.rotation === Rotation.Up) {
					if (direction === Direction.Up || direction === Direction.Down) {
						this.rotation = Rotation.Standing
					}
				}
			}
		})
	}

	private onUpdate(dt: number) {
		// if (UserInputService.IsKeyDown(settings.keybinds.Down)) {
		// 	this.rotate(Direction.Down)
		// } else if (UserInputService.IsKeyDown(settings.keybinds.Up)) {
		// 	this.rotate(Direction.Up)
		// } else if (UserInputService.IsKeyDown(settings.keybinds.Left)) {
		// 	this.rotate(Direction.Left)
		// } else if (UserInputService.IsKeyDown(settings.keybinds.Right)) {
		// 	this.rotate(Direction.Right)
		// }
	}
}

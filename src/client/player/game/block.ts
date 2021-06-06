import { Janitor } from "@rbxts/janitor"
import Make from "@rbxts/make"
import { Debris, RunService, TweenService, Workspace } from "@rbxts/services"
import { StartPosition } from "shared/level/level-config"
import { Math, roundTo } from "shared/utility/math"
import { v3, Vector3Math } from "shared/utility/vector3-utils"
import type { Game } from "./game"

function makePart(position: Vector3, size: Vector3) {
	return Make("Part", {
		Parent: Workspace,
		Position: position,
		Anchored: true,
		Size: size,
		CanCollide: true,
		Material: Enum.Material.SmoothPlastic,
		CustomPhysicalProperties: new PhysicalProperties(0.7, 0.2, 0, 1, 75),
	})
}

enum Rotation {
	Standing = "standing",
	Left = "left",
	Up = "up",
}

enum BlockState {
	Idle = "idle",
	Rotating = "rotating",
	Falling = "falling", // unanchored block exists but not this.instance
}

const rotation_vector3_map = {
	[Rotation.Standing]: v3.up,
	[Rotation.Left]: v3.right, // I guess I could rename it to Rotation.Right
	[Rotation.Up]: v3.forward,
}

function getInitialRotation(positions: Vector3[]): Rotation {
	const all_x_equal = positions.map((v) => v.X).every((x, _, arr) => x === arr[0])
	const all_y_equal = positions.map((v) => v.Y).every((y, _, arr) => y === arr[0])
	const all_z_equal = positions.map((v) => v.Z).every((z, _, arr) => z === arr[0])

	// print(`X: ${is_x_equal}, Y: ${is_y_equal}, Z: ${is_z_equal}`)
	if (!all_x_equal) return Rotation.Left
	if (!all_y_equal) return Rotation.Standing
	if (!all_z_equal) return Rotation.Up

	return Rotation.Standing
}

const x_rotation = Math.HALF_PI
const z_rotation = -Math.HALF_PI
const rotation_speed = math.rad(420) // per second
const block_spawn_height = new Vector3(0, 10, 0)
const block_spawn_time = 0.4

export class Block {
	public positions: Vector3[]
	public rotation: Rotation
	public length: number
	public state = BlockState.Idle

	private janitor = new Janitor<{ rotation: RBXScriptConnection }>()
	private instance?: BasePart

	constructor(positions: Vector3[]) {
		// check that all positions are of uniform distance apart

		// check direction parts are moving to get starter rotation
		this.rotation = getInitialRotation(positions)
		this.positions = positions
		this.length = positions.size()
		this.spawn()
	}

	public spawn() {
		// can only call spawn once at the start of the level
		if (this.instance && this.state !== BlockState.Falling) return
		this.state = BlockState.Falling

		// average position of all block positions
		const position = this.positions
			.reduce((total, current) => total.add(current), v3.zero)
			.div(this.positions.size())

		const length = rotation_vector3_map[this.rotation].mul(this.length)
		const size = new Vector3(math.max(length.X, 1), math.max(length.Y, 1), math.max(length.Z, 1))
		const instance = makePart(position.add(block_spawn_height), size)

		const tween = TweenService.Create(
			instance,
			new TweenInfo(block_spawn_time, Enum.EasingStyle.Cubic, Enum.EasingDirection.In),
			{ Position: position }
		)

		tween.Play()
		tween.Completed.Wait()

		this.instance = this.janitor.Add(instance)
		this.wobbleAsync()
		this.state = BlockState.Idle
	}

	public move(direction: Vector3) {
		print("moving")
		if (this.state !== BlockState.Idle) return
		// very basic checking, maybe do more later
		if (direction.Magnitude !== 1) return

		const block_z_offset =
			this.rotation === Rotation.Up ? (this.length * direction.Z) / 2 : direction.Z / 2

		const block_x_offset =
			this.rotation === Rotation.Left ? (this.length * direction.X) / 2 : direction.X / 2

		const block_offset = new Vector3(block_x_offset, -0.5, block_z_offset)
		const rotation_point = this.getPosition().add(block_offset)

		// rotate all vectors around rotation_point with given direction on each axis
		this.positions = this.positions.map((position) => {
			const v = Vector3Math.rotateXYZ(
				position,
				x_rotation * direction.Z,
				0,
				z_rotation * direction.X,
				rotation_point
			)

			return new Vector3(roundTo(v.X, 5), roundTo(v.Y, 5), roundTo(v.Z, 5))
		})

		// rotate instance around rotation point
		this.rotateBlock(direction, rotation_point)

		// update rotation
		switch (this.rotation) {
			case Rotation.Left:
				if (direction === v3.left || direction === v3.right) {
					this.rotation = Rotation.Standing
				}
				break

			case Rotation.Up:
				if (direction === v3.forward || direction === v3.back) {
					this.rotation = Rotation.Standing
				}
				break

			case Rotation.Standing:
				if (direction === v3.forward || direction === v3.back) {
					this.rotation = Rotation.Up
				} else {
					this.rotation = Rotation.Left
				}
				break
		}
	}

	private wobbleAsync() {
		if (!this.instance) return
		const rotation_points = []

		for (let x = -1; x < 2; x++) {
			for (let z = -1; z < 2; z++) {
				if (x === 0 && z === 0) continue
				const block_z_offset = this.rotation === Rotation.Up ? (this.length * z) / 2 : z / 2
				const block_x_offset = this.rotation === Rotation.Left ? (this.length * x) / 2 : x / 2
				const block_offset = new Vector3(block_x_offset, -0.5, block_z_offset)
				const rotation_point = this.getPosition().add(block_offset)

				rotation_points.push([rotation_point, new Vector3(x, 0, z)])
			}
		}

		// do the wobbling
		for (let i = 0; i < 2; i++) {
			const index = (0 + 2 * i + math.max(i - 1, 0)) % (rotation_points.size() - 1)
			const p = rotation_points[index][0]
			const dir = rotation_points[index][1]
			const cframe = this.instance.CFrame
			const point = new CFrame(p)
			const offset = point.Inverse().mul(cframe)

			const max_step = 8 - i
			for (let step = 1; step <= max_step; step++) {
				RunService.RenderStepped.Wait()

				const mul = Math.roundTo(math.sin(math.rad(step * (180 / max_step))), 2)
				const rotation = dir.mul(math.rad(mul) * (5 - i))
				const rotated_cframe = point.mul(CFrame.Angles(rotation.Z, rotation.Y, -rotation.X))
				this.instance.CFrame = rotated_cframe.mul(offset)
			}
		}

		for (let i = 0; i < 5; i++) {
			RunService.RenderStepped.Wait()
		}
	}

	private rotateBlock(direction: Vector3, rotation_point: Vector3) {
		if (!this.instance) return

		this.state = BlockState.Rotating
		const e = new Instance("BindableEvent")

		const cframe = this.instance.CFrame
		const point = new CFrame(rotation_point)
		const offset = point.Inverse().mul(cframe)

		let total_rotation = 0
		const update = (dt: number) => {
			// failsafe incase janitor isn't cleaned up before next renderstep
			if (!this.instance) return

			total_rotation += dt * rotation_speed
			total_rotation = math.clamp(total_rotation, 0, Math.HALF_PI)

			const rotation = direction.mul(total_rotation)
			const rotated_cframe = point.mul(CFrame.Angles(rotation.Z, rotation.Y, -rotation.X))
			this.instance.CFrame = rotated_cframe.mul(offset)

			if (total_rotation === Math.HALF_PI) {
				// stop rotating
				this.janitor.Remove("rotation")
				e.Fire()
			}
		}

		this.janitor.Add(RunService.RenderStepped.Connect(update), "Disconnect", "rotation")
		e.Event.Wait()
		this.state = BlockState.Idle
	}

	public isStanding(): boolean {
		return this.length > 1 ? this.rotation === Rotation.Standing : false
	}

	/**
	 * Returns the average position for Up and Left blocks, and the lowest position for Standing blocks.
	 */
	public getPosition() {
		// when SuperBlock is standing, all values in Vector3 will be the same except for Y
		if (this.isStanding()) {
			const min_y = math.min(...this.positions.map((position) => position.Y))
			const pos = this.positions[0]
			return new Vector3(pos.X, min_y, pos.Z)
		}

		// combine all positions together to get an average
		return this.positions.reduce((total, position) => total.add(position), v3.zero).div(this.length)
	}

	/**
	 * Returns the positions which are touching a tile (on ground)
	 */
	public getPositions(): Vector3[] {
		// Should only return one value as only one value will be touching a tile
		if (this.length <= 1 || this.isStanding()) {
			return [this.getPosition()]
		}

		// Return position of each cell in the Block
		return this.positions
	}

	public combine(block: Block): Block {
		print([...this.positions, ...block.positions])
		return new Block([...this.positions, ...block.positions])
	}

	public split() {}

	// make the player fall with a given velocity, such as when completing a level or falling off the map
	public fall(direction: Vector3 = v3.zero) {
		if (this.state === BlockState.Falling) return
		if (!this.instance) return
		// this.instance is managed by the janitor so I create a clone that won't be deleted when destroy is called
		const part = this.instance.Clone()
		part.Parent = Workspace
		part.Anchored = false
		Debris.AddItem(part, 2)
		this.janitor.Cleanup()
		this.state = BlockState.Falling

		// apply rotation to the part
		if (direction.Magnitude > 0) {
			const angular_impulse = Vector3Math.rotateY(direction.mul(part.Mass), math.pi / 2)
			part.ApplyAngularImpulse(angular_impulse)
		}
	}

	public destroy() {
		print(`destroying part: ${this.instance}, state: ${this.state}`)
		if (this.instance && this.state !== BlockState.Falling) {
			this.state = BlockState.Falling
			const part = this.instance.Clone()
			part.Parent = Workspace
			part.Anchored = false
			Debris.AddItem(part, 2)
		}
		this.janitor.Cleanup()
	}
}

export class BlockFactory {
	constructor(private project: Game) {}

	public createBlock(position: Vector3, direction = v3.up, length = 2) {
		const positions = []
		for (let i = 0; i < length; i++) {
			positions.push(position.add(direction.mul(i)))
		}

		return new Block(positions)
	}

	public fromStartPosition(position: StartPosition): Block {
		return this.createBlock(
			new Vector3(position.column, 0, position.row),
			position.direction,
			position.length
		)
	}

	public fromStartPositions(positions: StartPosition[]): Block[] {
		const blocks = []
		for (const position of positions) {
			blocks.push(this.fromStartPosition(position))
		}
		return blocks
	}
}

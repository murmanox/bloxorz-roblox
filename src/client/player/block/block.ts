import { Janitor } from "@rbxts/janitor"
import { LoliTween } from "@rbxts/loli-tween-animator/out/loli"
import { Debris, Workspace } from "@rbxts/services"
import { GAME_CONFIG } from "shared/config"
import { dbg } from "shared/utility/debug"
import { TweenPromise } from "shared/utility/tween"
import { v3, Vector3Math } from "shared/utility/vector3-utils"
import { IBlock } from "types/interfaces/block-types"
import { Effects } from "../game/effects/effects"
import { Rotation } from "./block-types"
import { getBlockPosition, getBlockSize, makeBlock } from "./block-utils"
import { RotateLogic } from "./rotate-logic"

export const DEFAULT_BLOCK_LENGTH = 2

let block_count = 0

const config = GAME_CONFIG.block

interface BlockJanitor {
	rotation: RBXScriptConnection
	instance: BasePart
	rotation_tween: LoliTween
}

export class Block implements IBlock {
	public positions: Vector3[]
	public rotation: Vector3
	public length: number

	public id = `BLOCK_${block_count++}`

	// state variables
	private is_rotating = false
	private is_animating = false
	private is_falling = false

	private janitor = new Janitor<BlockJanitor>()
	public instance: BasePart

	// classes
	private rotate_logic = new RotateLogic() // cool SRP technique I saw on youtube

	constructor(positions: Vector3[]) {
		if (positions.size() === 0) error("Empty array cannot be passed to Block constructor")

		dbg(`Creating ${this.id}`)

		// check direction parts are moving to get starter rotation
		this.positions = positions
		this.rotation = this.rotate_logic.initialRotation(positions)
		this.length = positions.size()

		this.instance = makeBlock(this.positions, this.rotation, this.length)
	}

	public show() {
		this.instance.Parent = config.parent
		return this
	}

	// make the block fall from the sky into position
	public spawn(offset: Vector3) {
		const tween_info = new TweenInfo(config.spawn_time, Enum.EasingStyle.Cubic, Enum.EasingDirection.In)

		const position = getBlockPosition(this.positions, offset)
		this.instance.Position = position.add(config.spawn_height)
		this.instance.Parent = Workspace

		this.is_animating = true
		const tween = new TweenPromise(this.instance, tween_info, { Position: position })
		return tween
			.play()
			.then(() => {
				if (this.isStanding()) {
					return Effects.wobble(this.instance)
				}
			})
			.finally(() => {
				print("animation done")
				this.is_animating = false
			})
	}

	public blinkIn() {
		this.is_animating = true
		this.instance.Position = this.instance.Position.add(GAME_CONFIG.board.position)
		return Effects.blinkIn(this.instance, Workspace).finally(() => {
			this.is_animating = false
		})
	}

	public blinkOut() {
		this.is_animating = true
		return Effects.blinkOut(this.instance).finally(() => {
			this.is_animating = false
		})
	}

	/**
	 * @param direction The direction to move the block
	 */
	public move(direction: Vector3): Promise<void> {
		if (this.is_rotating) Promise.resolve()
		if (direction.Magnitude !== 1) return error(`Invalid unit vector: ${direction}`)

		this.is_rotating = true
		const tween = this.rotate_logic.rotateBlock(this, direction)
		this.janitor.Add(tween, "destroy", "rotation_tween")

		return tween.then(() => {
			// Set rotating to false to signify the end of the animation
			this.is_rotating = false
		})
	}

	public isStanding(): boolean {
		return this.length > 1 ? this.rotation === Rotation.Standing : false
	}

	/**
	 * Returns the average position for Up and Left blocks, and the lowest position for Standing blocks.
	 */
	public getPosition(): Vector3 {
		if (this.length === 1) {
			return this.positions[0]
		}

		const min_y = math.min(...this.positions.map((position) => position.Y))

		if (this.isStanding()) {
			const pos = this.positions[0]
			return new Vector3(pos.X, min_y, pos.Z)
		}

		// combine all positions together to get an average
		const average_pos = this.positions
			.reduce((total, position) => total.add(position), v3.zero)
			.div(this.length)

		return new Vector3(average_pos.X, min_y, average_pos.Z)
	}

	/**
	 * Returns the positions which are touching a tile (on ground)
	 */
	public getPositions(): Vector3[] {
		if (this.length === 1 || this.isStanding()) {
			return [this.getPosition()]
		}
		return this.positions
	}

	public combine(block: Block): Block {
		return new Block([...this.positions, ...block.positions])
	}

	public split(positions: BoardPosition[]): Block[] {
		if (positions.size() !== this.length) {
			error(
				`Mismatch between teleport destinations and block length. Expected ${this.length} positions, got ${this.length}`
			)
		}

		return positions.map((position) => {
			return new Block([new Vector3(position.column, 0, position.row)])
		})
	}

	/**
	 * Make the player fall with a given velocity, such as when completing a level or falling off the map
	 */
	public fall(direction: Vector3 = v3.zero, fall_time = 2) {
		// Make sure block is being rendered
		if (!this.instance.IsDescendantOf(Workspace)) return

		// Make sure block isn't already falling
		if (this.is_falling) return
		this.is_falling = true
		dbg("Creating falling part")

		this.janitor.Remove("rotation_tween")

		this.instance.Anchored = false
		Debris.AddItem(this.instance, fall_time)

		// apply rotation to the part
		if (direction.Magnitude > 0) {
			const mass = this.instance.Mass
			const angular_impulse = Vector3Math.rotateY(direction.mul(mass), math.pi / 2)
			this.instance.ApplyAngularImpulse(angular_impulse)
		}
	}

	public destroy(fall_time: number = 2) {
		dbg(`Destroying ${this.id}`)
		this.janitor.Cleanup()
		this.instance.Destroy()
	}
}

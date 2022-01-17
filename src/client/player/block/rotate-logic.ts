import { LoliTween } from "@rbxts/loli-tween-animator/out/loli"
import { GAME_CONFIG } from "shared/config"
import { Math, roundTo } from "shared/utility/math"
import { v3, Vector3Math } from "shared/utility/vector3-utils"
import { Effects } from "../game/effects/effects"
import { Block } from "./block"
import { Rotation } from "./block-types"
import { getBlockPosition, getBlockSize } from "./block-utils"

const position_offset = new Vector3(0.5, 0.5, 0.5)
const rotation_point_offset = new Vector3(0.5, 0, 0.5)
const x_rotation = Math.HALF_PI
const z_rotation = -Math.HALF_PI

const config = GAME_CONFIG.block

export class RotateLogic {
	initialRotation(positions: Vector3[]) {
		if (positions.size() === 1) return Rotation.Standing

		const all_x_equal = positions.map((v) => v.X).every((x, _, arr) => x === arr[0])
		const all_y_equal = positions.map((v) => v.Y).every((y, _, arr) => y === arr[0])
		const all_z_equal = positions.map((v) => v.Z).every((z, _, arr) => z === arr[0])

		if (!all_x_equal) return Rotation.Left
		if (!all_y_equal) return Rotation.Standing
		if (!all_z_equal) return Rotation.Up

		error("Cannot get rotation from non-adjacent positions")
	}

	updateRotation(rotation: Vector3, direction: Vector3): Vector3 {
		if (
			(rotation === Rotation.Left && (direction === v3.left || direction === v3.right)) ||
			(rotation === Rotation.Up && (direction === v3.forward || direction === v3.back))
		) {
			return Rotation.Standing
		}

		if (rotation === Rotation.Standing) {
			return direction === v3.forward || direction === v3.back ? Rotation.Up : Rotation.Left
		}

		return rotation
	}

	/**
	 * Rotate a block in a given direction
	 * @param block
	 * @param direction
	 * @returns
	 */
	rotateBlock(block: Block, direction: Vector3): LoliTween {
		// Set position before moving to prevent desyncs
		block.instance.Position = getBlockPosition(block.positions)
		block.instance.Size = getBlockSize(block.rotation, block.length)

		const block_offset = getBlockSize(block.rotation, block.length).mul(direction).div(2)
		const rotation_point = block.getPosition().add(block_offset)

		// rotate all vectors around rotation_point with given direction on each axis
		block.positions = block.positions.map((position) => {
			const v = Vector3Math.rotateXYZ(
				position.add(position_offset),
				x_rotation * direction.Z,
				0,
				z_rotation * direction.X,
				rotation_point.add(rotation_point_offset)
			)

			return new Vector3(roundTo(v.X, 5), roundTo(v.Y, 5), roundTo(v.Z, 5)).sub(position_offset)
		})

		const rotate_tween = Effects.rotateAround(
			block.instance,
			rotation_point,
			direction,
			Math.HALF_PI,
			config.rotation_speed
		)

		rotate_tween.then(() => {
			// Update rotation value based on current rotation and direction moved
			block.rotation = this.updateRotation(block.rotation, direction)
			// Update position and size after move to prevent desyncs
			block.instance.Position = getBlockPosition(block.positions)
			block.instance.Size = getBlockSize(block.rotation, block.length)
			block.instance.Rotation = v3.zero
		})

		return rotate_tween
	}
}

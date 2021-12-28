import { v3 } from "shared/utility/vector3-utils"
import { Rotation } from "./block-types"

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

	rotate(rotation: Vector3, direction: Vector3): Vector3 {
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
}

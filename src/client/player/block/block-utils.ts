import Make from "@rbxts/make"
import { PhysicsService } from "@rbxts/services"
import { v3 } from "shared/utility/vector3-utils"

const min1 = (v: number) => math.max(v, 1)

export function getBlockPosition(positions: Vector3[], offset = v3.zero) {
	return positions
		.reduce((total, current) => total.add(current), v3.zero)
		.div(positions.size())
		.add(new Vector3(0, 0.5, 0).add(offset))
}

export function getBlockSize(rotation: Vector3, length: number): Vector3 {
	const size = rotation.mul(length)
	return new Vector3(min1(size.X), min1(size.Y), min1(size.Z))
}

export function makeBlock(positions: Vector3[], rotation: Vector3, length: number): BasePart {
	const part = Make("Part", {
		Position: getBlockPosition(positions),
		Anchored: true,
		Size: getBlockSize(rotation, length),
		CanCollide: true,
		Material: Enum.Material.SmoothPlastic,
		CustomPhysicalProperties: new PhysicalProperties(0.7, 0.2, 0, 1, 75),
	})
	PhysicsService.SetPartCollisionGroup(part, "Player")
	return part
}

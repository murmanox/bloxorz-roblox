import Make from "@rbxts/make"
import { Workspace } from "@rbxts/services"

export function makeDebugPart(
	position: Vector3,
	size = new Vector3(0.1, 0.1, 0.1),
	parent: Instance = Workspace
) {
	return Make("Part", {
		Parent: parent,
		Anchored: true,
		Position: position,
		Size: size,
		Color: new Color3(math.random(), math.random(), math.random()),
	})
}

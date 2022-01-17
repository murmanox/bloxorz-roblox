import { loli } from "@rbxts/loli-tween-animator"
import { GAME_CONFIG } from "shared/config"
import { Math } from "shared/utility/math"
import { ITile } from "types/interfaces/tile-types"

const config = GAME_CONFIG.tile
export function verticalInAnimation(tile: ITile, position: Vector3): Promise<void> {
	const instance = tile.instance
	if (!instance) return Promise.resolve()

	const goal = new CFrame(position, position.add(instance.GetPivot().LookVector))
	instance.PivotTo(goal.add(new Vector3(0, -15, 0)))

	const delay = Math.random(config.tween_delay.min, config.tween_delay.max)
	return loli
		.to(instance.GetPivot(), {
			duration: 0.5,
			delay: delay,
			goal: goal,
			ease: "power3.out",
			onUpdate: (cframe) => {
				instance.PivotTo(cframe)
			},
		})
		.then()
}

export function verticalOutAnimation(tile: ITile): Promise<void> {
	const instance = tile.instance
	if (!instance) return Promise.resolve()

	const change = new Vector3(0, -13, 0)
	const tile_cframe = instance.GetPivot()
	const goal = tile_cframe.add(change)

	const delay = Math.random(config.tween_delay.min, config.tween_delay.max)
	return loli
		.to(tile_cframe, {
			duration: 0.5,
			delay,
			goal,
			ease: "power2.in",
			onUpdate: (cframe) => {
				instance.PivotTo(cframe)
			},
		})
		.then()
}

import { loli } from "@rbxts/loli-tween-animator"
import { LoliTween } from "@rbxts/loli-tween-animator/out/loli"
import { RunService, Workspace } from "@rbxts/services"
import { Math } from "shared/utility/math"
import { TweenPromise } from "shared/utility/tween"

const EFFECTS_CONTAINER = Workspace

export namespace Effects {
	export function blinkIn(instance: BasePart, parent: Instance): VoidPromise {
		const glow_part = instance.Clone()
		glow_part.Size = glow_part.Size.mul(1.01)
		glow_part.Material = Enum.Material.Neon
		glow_part.Color = new Color3(1, 1, 1)
		glow_part.Transparency = 1
		glow_part.Parent = EFFECTS_CONTAINER

		return new TweenPromise(glow_part, new TweenInfo(0.2), { Transparency: 0 })
			.play()
			.then(() => {
				instance.Parent = parent
				return new TweenPromise(glow_part, new TweenInfo(0.05), { Transparency: 1 }).play()
			})
			.then(() => {
				glow_part.Destroy()
			})
	}

	export function blinkOut(instance: BasePart): VoidPromise {
		return new Promise((resolve, reject, onCancel) => {
			const glow_part = instance.Clone()
			glow_part.Size = glow_part.Size.mul(1.01)
			glow_part.Material = Enum.Material.Neon
			glow_part.Color = new Color3(1, 1, 1)
			glow_part.Transparency = 1
			glow_part.Parent = EFFECTS_CONTAINER

			new TweenPromise(glow_part, new TweenInfo(0.3), { Transparency: 0 })
				.play()
				.then(() => {
					instance.Parent = undefined
					resolve()
					return new TweenPromise(glow_part, new TweenInfo(0.05), { Transparency: 1 }).delay(0.05)
				})
				.finally(() => {
					glow_part.Destroy()
				})
		})
	}

	export function wobble(instance: BasePart): VoidPromise {
		return new Promise((resolve, reject, onCancel) => {
			const rotation_points = []

			for (let x = -1; x <= 1; x++) {
				for (let z = -1; z <= 1; z++) {
					if (x === 0 && z === 0) continue

					const size = instance.Size
					const position = instance.Position
					const y_offset = -instance.Size.Y / 2
					const z_offset = (size.Z / 2) * z
					const x_offset = (size.X / 2) * x

					// const offset
					const rotation_point = new Vector3(
						position.X + x_offset,
						position.Y + y_offset,
						position.Z + z_offset
					)
					rotation_points.push([rotation_point, new Vector3(x, 0, z)])
				}
			}

			// do the wobbling
			const wobble_index = math.random(0, rotation_points.size())
			for (let i = 0; i < 2; i++) {
				const index = (wobble_index + 2 * i + math.max(i - 1, 0)) % (rotation_points.size() - 1)
				const p = rotation_points[index][0]
				const dir = rotation_points[index][1]
				const cframe = instance.CFrame
				const point = new CFrame(p)
				const offset = point.Inverse().mul(cframe)

				const max_step = 8 - i
				for (let step = 1; step <= max_step; step++) {
					RunService.RenderStepped.Wait()

					const mul = Math.roundTo(math.sin(math.rad(step * (180 / max_step))), 2)
					const rotation = dir.mul(math.rad(mul) * (4 - i))
					const rotated_cframe = point.mul(CFrame.Angles(rotation.Z, rotation.Y, -rotation.X))
					instance.CFrame = rotated_cframe.mul(offset)
				}
			}

			for (let i = 0; i < 5; i++) {
				RunService.RenderStepped.Wait()
			}
			resolve()
		})
	}

	export function rotateAround(
		instance: PVInstance,
		rotation_point: Vector3,
		direction: Vector3,
		angle: number,
		speed: number
	): LoliTween {
		const point = new CFrame(rotation_point)
		const offset = point.Inverse().mul(instance.GetPivot())

		// Tween block's rotation around rotation point
		return loli.to(0, {
			goal: angle,
			duration: angle / speed,
			ease: "none",
			onUpdate: (v) => {
				const rotation = direction.mul(v)
				const rotated_cframe = point.mul(CFrame.Angles(rotation.Z, rotation.Y, -rotation.X))
				instance.PivotTo(rotated_cframe.mul(offset))
			},
		})
	}
}

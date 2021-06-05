import Make from "@rbxts/make"
import { ReplicatedStorage, SoundService, TweenService } from "@rbxts/services"
import { ButtonAction } from "shared/game/tiles/tile-types"
import { Math } from "shared/utility/math"
import { v3 } from "shared/utility/vector3-utils"
import { Block } from "../block"
import type { Board } from "../board"

type TileProperties = {
	size?: Vector3
	colour?: Color3
}

const tile_size = new Vector3(1, 0.2, 1)
const tile_size_y = tile_size.mul(v3.up).div(2)
const tile_slide_offset = new Vector3(0, -13, 0)

let last_time = 0
export default class Tile {
	private static texture = "rbxasset://assets/bloxorz/images/tile.png"
	public instance?: BasePart | Model

	activate(action: ButtonAction) {}
	onStepped(block: Block) {}

	isLosingPosition(block: Block): boolean {
		return false
	}

	isWinningPosition(block: Block): boolean {
		return false
	}

	draw(position: Vector3, completed: Callback, properties: TileProperties = {}) {
		const tile_out_position = position.add(tile_slide_offset)
		const instance = Tile.makeTile(tile_out_position, properties)
		Tile.tweenTile(instance, position.sub(tile_size_y), () => {
			// play sound
			const current_time = tick()
			if (last_time - current_time < -0.05) {
				last_time = current_time
				const sound = ReplicatedStorage.assets.audio.stone_impact.Clone()
				sound.PlaybackSpeed = Math.randomDecimal(0.9, 1.1, 3)
				sound.Volume = 0.1
				sound.Parent = SoundService
				sound.Ended.Connect(() => {
					sound.Destroy()
				})
				sound.Play()
			}

			completed()
		})

		return {
			instance: instance as BasePart | Model,
			show: (parent: Instance) => {
				instance.Parent = parent
			},
			callback: (animate_out_callback: Callback) => {
				Tile.tweenTile(instance, tile_out_position, animate_out_callback)
			},
		}
	}

	public static makeTile(position: Vector3, { size = tile_size, colour }: TileProperties = {}) {
		return Make("Part", {
			Position: position.sub(tile_size_y),
			Size: size,
			Anchored: true,
			Children: [
				Make("Decal", {
					Texture: "rbxasset://assets/bloxorz/images/tile.png",
					Face: Enum.NormalId.Top,
					Color3: colour,
				}),
				Make("Texture", {
					Texture: "rbxassetid://6666199681",
					StudsPerTileU: 1,
					OffsetStudsV: 1,
					Face: Enum.NormalId.Back,
					Color3: colour,
				}),
				Make("Texture", {
					Texture: "rbxassetid://6666199681",
					StudsPerTileU: 1,
					OffsetStudsV: 1,
					Face: Enum.NormalId.Left,
					Color3: colour,
				}),
			],
		})
	}

	public static tweenTile(tile: BasePart, position: Vector3, callback: Callback) {
		delay(math.random(75, 100) / 100, () => {
			const tween = TweenService.Create(tile, new TweenInfo(0.5), {
				CFrame: new CFrame(position, position.add(tile.CFrame.LookVector)),
			})

			const c = tween.Completed.Connect(() => {
				callback()
				c.Disconnect()
			})
			tween.Play()
		})
	}
}

import { ReplicatedStorage, TweenService, Workspace } from "@rbxts/services"
import { v3 } from "shared/utility/vector3-utils"
import Tile from "./tile"
import { Block } from "../block"

const end_tile_mesh = ReplicatedStorage.assets.mesh.endtile
const tile_size = end_tile_mesh.Size
const tile_size_y = tile_size.mul(v3.up).div(2)
const tile_slide_offset = new Vector3(0, -13, 0)

export default class EndTile extends Tile {
	isWinningPosition(block: Block): boolean {
		return block.isStanding()
	}

	draw(position: Vector3, completed: Callback) {
		const tile_out_position = position.add(tile_slide_offset)
		const instance = end_tile_mesh.Clone()
		instance.Position = tile_out_position
		instance.Parent = Workspace
		Tile.tweenTile(instance, position.sub(tile_size_y), completed)

		return {
			instance: instance,
			show: (parent: Instance) => {
				// I'd like to find a better way around this if possible, maybe pass parent to the draw function?
				instance.Parent = parent
			},
			callback: (animate_out_callback: Callback) => {
				instance.Transparency = 1
				Tile.tweenTile(instance, tile_out_position, animate_out_callback)
			},
		}
	}
}

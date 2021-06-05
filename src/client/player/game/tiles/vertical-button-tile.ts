import { ReplicatedStorage, Workspace } from "@rbxts/services"
import { v3 } from "shared/utility/vector3-utils"
import { Block } from "../block"
import ButtonTile from "./button-tile"
import type { Board } from "../board"
import Tile from "./tile"

const button_tile_mesh = ReplicatedStorage.assets.tiles.x_button
const tile_size = button_tile_mesh.tile.Size
const tile_size_y = tile_size.mul(v3.up).div(2)
const tile_slide_offset = new Vector3(0, -13, 0)

// this can be simplified into a single button class with traits
export default class VerticalButtonTile extends ButtonTile {
	constructor(board: Board, targets: Position[]) {
		super(board, targets)
	}

	onStepped(block: Block) {
		if (block.isStanding()) {
			this.activated()
		}
	}

	draw(position: Vector3, completed: Callback) {
		const tile_out_position = position.add(tile_slide_offset)
		const instance = button_tile_mesh.Clone()
		instance.SetPrimaryPartCFrame(new CFrame(tile_out_position))

		instance.Parent = Workspace
		Tile.tweenTile(instance.tile, position.sub(tile_size_y), completed)

		return {
			instance: instance,
			show: (parent: Instance) => {
				instance.Parent = parent
			},
			callback: (animate_out_callback: Callback) => {
				Tile.tweenTile(instance.tile, tile_out_position, animate_out_callback)
			},
		}
	}
}

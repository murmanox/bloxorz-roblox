import { ReplicatedStorage, Workspace } from "@rbxts/services"
import { ButtonAction } from "shared/game/tiles/tile-types"
import { v3 } from "shared/utility/vector3-utils"
import { Block } from "../block"
import type { Board } from "../board"
import Tile from "./tile"

const button_tile_mesh = ReplicatedStorage.assets.tiles.o_button
const tile_size = button_tile_mesh.tile.Size
const tile_size_y = tile_size.mul(v3.up).div(2)
const tile_slide_offset = new Vector3(0, -13, 0)

export default class ButtonTile extends Tile {
	constructor(
		private board: Board,
		private targets: Position[],
		private action: ButtonAction = ButtonAction.Toggle
	) {
		super()
	}

	onStepped(block: Block) {
		this.activated()
	}

	activated() {
		const tiles = this.targets.map((position) => this.board.getTile(position.column, position.row))
		tiles.forEach((tile) => {
			if (tile) {
				tile.activate(this.action)
			}
		})
	}

	draw(position: Vector3, completed: Callback) {
		const tile_out_position = position.add(tile_slide_offset)
		const instance = button_tile_mesh.Clone()
		instance.SetPrimaryPartCFrame(new CFrame(tile_out_position))

		instance.Parent = Workspace
		Tile.tweenTile(instance.tile, position.sub(tile_size_y), completed)

		return {
			instance: instance as BasePart | Model,
			show: (parent: Instance) => {
				instance.Parent = parent
			},
			callback: (animate_out_callback: Callback) => {
				Tile.tweenTile(instance.tile, tile_out_position, animate_out_callback)
			},
		}
	}
}

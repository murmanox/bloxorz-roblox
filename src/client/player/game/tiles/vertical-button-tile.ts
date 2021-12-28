import { ReplicatedStorage } from "@rbxts/services"
import { Block } from "../../block/block"
import { Board } from "../board/board"
import BaseButtonTile from "./base-button-tile"
import { ButtonAction } from "../../../../shared/game/tiles/ButtonAction"
import { TileModel } from "./types"

const model = ReplicatedStorage.assets.tiles.x_button as TileModel
export default class VerticalButtonTile extends BaseButtonTile {
	protected instance: TileModel

	constructor(
		board: Board,
		position: Vector3,
		targets: BoardPosition[],
		action: ButtonAction = ButtonAction.Toggle
	) {
		super(board, position, targets, action, model)
		this.instance = this.makeTile(this.out_position)
	}

	onStepped(block: Block) {
		if (block.isStanding()) {
			this.activated(block)
		}
	}
}

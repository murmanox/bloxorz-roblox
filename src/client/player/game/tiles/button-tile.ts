import { ReplicatedStorage } from "@rbxts/services"
import type { Board } from "../board/board"
import BaseButtonTile from "./base-button-tile"
import { ButtonAction } from "../../../../shared/game/tiles/ButtonAction"
import { TileModel } from "./types"

const model = ReplicatedStorage.assets.tiles.o_button as TileModel
export default class ButtonTile extends BaseButtonTile {
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
}

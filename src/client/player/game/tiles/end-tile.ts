import { ReplicatedStorage } from "@rbxts/services"
import { Block } from "../../block/block"
import { Board } from "../board/board"
import BaseTile from "./base-tile"
import { TileModel } from "./types"

const model = ReplicatedStorage.assets.tiles.endtile as TileModel
export default class EndTile extends BaseTile {
	protected instance: TileModel

	constructor(board: Board, position: Vector3) {
		super(board, position, model)
		this.instance = this.makeTile(this.out_position)
	}

	isWinningPosition(block: Block): boolean {
		return block.isStanding()
	}
}

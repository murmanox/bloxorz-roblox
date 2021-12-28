import { ReplicatedStorage, TweenService, Workspace } from "@rbxts/services"
import { Block } from "../../block/block"
import { Board } from "../board/board"
import BaseTile from "./base-tile"
import { ButtonAction } from "../../../../shared/game/tiles/ButtonAction"
import { TileModel } from "./types"

const model = ReplicatedStorage.assets.tiles.tile as TileModel
export default class Tile extends BaseTile {
	protected instance: TileModel

	constructor(board: Board, position: Vector3) {
		super(board, position, model)
		this.instance = this.makeTile(this.out_position)
	}

	activate(action: ButtonAction) {}
	onStepped(block: Block) {}

	isLosingPosition(block: Block): boolean {
		return false
	}

	isWinningPosition(block: Block): boolean {
		return false
	}
}

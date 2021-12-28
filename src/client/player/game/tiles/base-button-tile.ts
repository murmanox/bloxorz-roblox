import { Block } from "../../block/block"
import type { Board } from "../board/board"
import BaseTile from "./base-tile"
import { ButtonAction } from "../../../../shared/game/tiles/ButtonAction"
import { TileModel } from "./types"

export default abstract class BaseButtonTile extends BaseTile {
	protected abstract instance: TileModel

	constructor(
		board: Board,
		position: Vector3,
		public targets: BoardPosition[],
		protected action: ButtonAction = ButtonAction.Toggle,
		model: TileModel
	) {
		super(board, position, model)
	}

	onStepped(block: Block) {
		this.activated(block)
	}

	activated(block: Block) {
		const tiles = this.targets.map((position) =>
			this.board.tiles.getTile(position.column, position.row)
		)
		tiles.forEach((tile) => {
			if (tile) {
				tile.activate(this.action)
			}
		})
	}
}

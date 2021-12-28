import { ReplicatedStorage, Workspace } from "@rbxts/services"
import { Block } from "../../block/block"
import { Board } from "../board/board"
import BaseButtonTile from "./base-button-tile"
import { ButtonAction } from "../../../../shared/game/tiles/ButtonAction"
import { TileModel } from "./types"

const model = ReplicatedStorage.assets.tiles.teleporter as TileModel
export default class TeleportTile extends BaseButtonTile {
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

	public isActivated(block: Block): boolean {
		return block.isStanding()
	}

	public activated(block: Block) {
		// play split animation
		block
			.blinkOut()
			.then(() => {
				// spawn new block instances
				const new_blocks = block.split(this.targets)

				// this.blocks.remove(this.blocks.findIndex((find_block) => find_block === block))
				// this.blocks = [...this.blocks, ...new_blocks]
				// this.current_block = new_blocks[0]

				// animate new block instances
				return Promise.all(new_blocks.map((block) => block.blinkIn(this.board.position)))
			})
			.then(() => {
				// destroy original block
				block.destroy(0)
			})
	}
	// }
}

import { Block } from "client/player/block/block"
import { TileManager } from "./tile-manager"

export class BoardLogic {
	public checkWin(blocks: Block[], tiles: TileManager): boolean {
		if (blocks.size() !== 1) {
			return false
		}

		const block = blocks[0]
		const tiles_touching = block
			.getPositions()
			.map((position) => tiles.getTile(position.X, position.Z))

		// all touched tiles are in a winning state
		if (tiles_touching.every((tile) => tile.isWinningPosition(block))) {
			return true
		}
		return false
	}

	public checkLoss(blocks: Block[], tiles: TileManager): boolean {
		for (const block of blocks) {
			const tiles_touching = block
				.getPositions()
				.map((position) => tiles.getTile(position.X, position.Z))

			// at least one of the tiles is a losing position
			if (tiles_touching.some((tile) => tile.isLosingPosition(block))) {
				return true
			}
		}
		return false
	}
}

import { IBlock } from "types/interfaces/block-types"
import { ITile } from "types/interfaces/tile-types"

/**
 * Represents an empty tile on the board.
 */
class EmptyTile implements ITile {
	public stepped(block: IBlock): Promise<boolean> {
		return Promise.resolve(false)
	}

	public isLosingPosition(block: IBlock): boolean {
		return true
	}

	public isWinningPosition(block: IBlock): boolean {
		return false
	}

	public activate(action: "toggle" | "activate" | "deactivate"): void {
		return
	}
}

export const EMPTY_TILE = new EmptyTile()

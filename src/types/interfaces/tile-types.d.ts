import { IBlock } from "./block-types"

export type TileAction = "toggle" | "activate" | "deactivate"

export interface TileTarget {
	column: number
	row: number
}

interface CanToggle {
	toggle?: { initial: boolean }
}

interface ButtonProps extends CanToggle {
	kind: "button"
	activate?: TileTarget[]
	teleport?: TileTarget[]
	heavy?: boolean
	action?: TileAction
}

interface TileProps extends CanToggle {
	kind: "tile"
	fragile?: boolean
}

interface EndProps {
	kind: "end"
}

export type TileProperties = TileProps | ButtonProps | EndProps

/**
 * Interface that represents a tile on the Board
 */
export interface ITile {
	/**
	 * The model to use when displaying the tile
	 */
	instance?: Model

	/**
	 * Called when the tile is activated through external means, such as a player stepping on a button.
	 * @param action The type of action to take on the tile
	 */
	activate(action: TileAction): void

	/**
	 * Called when the player moves above the tile.
	 * @param block The block that's above the tile
	 */
	stepped(block: IBlock): Promise<boolean>

	/**
	 * If the tile is a losing position with a given block
	 * @param block The block that's above the tile
	 */
	isLosingPosition(block: IBlock): boolean

	/**
	 * If the tile is a winning position with a given block
	 * @param block The block that's above the tile
	 */
	isWinningPosition(block: IBlock): boolean
}

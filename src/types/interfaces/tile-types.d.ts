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

export interface ITile {
	instance?: Model

	activate(action: ButtonProps["action"]): void
	stepped(block: IBlock): Promise<boolean>
	toggle(value: boolean): void
	isLosingPosition(block: IBlock): boolean
	isWinningPosition(block: IBlock): boolean
}

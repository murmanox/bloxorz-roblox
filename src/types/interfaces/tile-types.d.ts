import { IBlock } from "./block-types"

interface Target {
	column: number
	row: number
}

interface CanToggle {
	toggle?: { initial: boolean }
}

interface ButtonProps extends CanToggle {
	kind: "button"
	activate?: Target[]
	teleport?: Target[]
	heavy?: boolean
	action?: "toggle" | "activate" | "deactivate"
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
	// instance?: PVInstance
	instance?: Model

	activate(action: ButtonProps["action"]): void
	stepped(block: IBlock): void
	toggle(value: boolean): void
	isLosingPosition(block: IBlock): boolean
	isWinningPosition(block: IBlock): boolean
}

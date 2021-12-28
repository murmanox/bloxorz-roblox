import { ReplicatedStorage } from "@rbxts/services"
import { Block } from "client/player/block/block"
import { ITile, TileProperties } from "types/interfaces/tile-types"
import { Board } from "../board/board"

const PREFABS = ReplicatedStorage.assets.tiles

export class Tile implements ITile {
	private model: Model
	public instance: Model
	// private model: PVInstance
	// public instance: PVInstance

	private is_end = false
	private is_fragile = false
	private is_enabled = true
	private is_toggle = false

	private board: Board
	constructor(board: Board, properties: TileProperties) {
		this.board = board

		// tile is a button
		if (properties.kind === "button") {
			if (properties.teleport) {
				this.model = PREFABS.teleporter
			} else if (properties.heavy) {
				this.model = PREFABS.x_button
			} else {
				this.model = PREFABS.o_button
			}
		}

		// tile is an end tile
		else if (properties.kind === "end") {
			this.is_end = true
			this.model = PREFABS.endtile
		}

		// tile is a tile
		else {
			if (properties.fragile) {
				this.model = PREFABS.wooden
			} else if (properties.toggle) {
				this.model = PREFABS.toggle
				this.is_toggle = true
			} else {
				this.model = PREFABS.tile
			}
		}

		if (properties.kind === "tile") {
			if (properties.toggle) {
				this.is_enabled = properties.toggle.initial
			}
		}

		this.instance = this.model.Clone()

		// do initial toggle stuff
	}

	public activate(action: "toggle" | "activate" | "deactivate" = "toggle") {}
	public stepped(block: Block) {}
	public toggle(value: boolean) {
		this.is_enabled = value
	}

	public isLosingPosition(block: Block) {
		// check if fragile
		if (this.is_fragile && block.isStanding()) {
			return true
		}

		// check if disabled (toggled out)
		if (!this.is_enabled) {
			return true
		}

		return false
	}
	public isWinningPosition(block: Block): boolean {
		return this.is_end && block.isStanding()
	}
}

export const empty_tile: ITile = {
	activate: (action: "toggle" | "activate" | "deactivate" | undefined): void => {},
	stepped: (block: Block): void => {},
	toggle: (value: boolean): void => {},
	isLosingPosition: (block: Block): boolean => true,
	isWinningPosition: (block: Block): boolean => false,
}

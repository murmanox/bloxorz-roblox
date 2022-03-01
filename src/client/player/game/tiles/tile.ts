import Llama from "@rbxts/llama"
import { ReplicatedStorage, Workspace } from "@rbxts/services"
import { Block } from "client/player/block/block"
import { ITile, TileAction, TileProperties, TileTarget } from "types/interfaces/tile-types"
import { Board } from "../board/board"

const PREFABS = ReplicatedStorage.assets.tiles

function getTileModel(properties: DefaultProps): Model {
	// tile is a button
	if (properties.kind === "button") {
		if (properties.teleport.size() > 0) {
			return PREFABS.teleporter
		} else if (properties.heavy) {
			return PREFABS.x_button
		} else {
			return PREFABS.o_button
		}
	}

	// tile is an end tile
	else if (properties.kind === "end") {
		return PREFABS.endtile
	}

	// tile is a tile
	else {
		if (properties.fragile) {
			return PREFABS.wooden
		} else if (properties.toggle) {
			return PREFABS.toggle
		} else {
			return PREFABS.tile
		}
	}
}

interface DefaultProps {
	kind: "button" | "tile" | "end"
	activate: TileTarget[]
	teleport: TileTarget[]
	heavy: boolean
	action: TileAction
	fragile: boolean
	toggle: boolean
	initial: boolean
}

function mergeDefaultProps(properties: TileProperties) {
	const props = {
		...properties,
		toggle: "toggle" in properties,
		initial: "toggle" in properties ? properties.toggle!.initial : true,
	}

	return Llama.Dictionary.mergeDeep(defaults, props) as DefaultProps
}

const defaults: DefaultProps = {
	kind: "tile",
	fragile: false,
	activate: [],
	teleport: [],
	heavy: false,
	toggle: false,
	initial: true,
	action: "toggle",
}

export class Tile implements ITile {
	public instance: Model

	private is_end: boolean

	private action: TileAction
	private activate_targets: TileTarget[]
	private teleport_targets: TileTarget[]

	private is_heavy: boolean
	private is_fragile: boolean
	private is_enabled: boolean
	private can_toggle: boolean

	private board: Board
	constructor(board: Board, properties: TileProperties) {
		this.board = board

		const props = mergeDefaultProps(properties)
		this.instance = getTileModel(props).Clone()

		this.is_end = props.kind === "end"
		this.can_toggle = props.toggle
		this.is_enabled = props.initial
		this.is_fragile = props.fragile
		this.is_heavy = props.heavy

		this.action = props.action
		this.activate_targets = props.activate
		this.teleport_targets = props.teleport
	}

	public activate(action: "toggle" | "activate" | "deactivate" = "toggle") {
		if (this.can_toggle && action === "toggle") {
			this.toggle(!this.is_enabled)
		}
	}

	public stepped(block: Block): Promise<boolean> {
		// Check if tile should run effects
		if (this.is_heavy && !block.isStanding()) {
			return Promise.resolve(false)
		}

		// activate target tiles
		const promises: Promise<boolean>[] = []
		if (this.activate_targets.size() > 0) {
			const targets = this.activate_targets.map((v) => this.board.getTile(v.column, v.row))
			targets.forEach((t) => t.activate(this.action))
			promises.push(Promise.resolve(true))
		}

		// teleport block
		if (this.teleport_targets.size() > 0) {
			const p = this.board.block_controller.split(block, this.teleport_targets).then(() => true)
			promises.push(p)
		}

		return Promise.all(promises).then(() => promises.size() > 0)
	}

	public toggle(value: boolean) {
		this.is_enabled = value
		this.instance.Parent = value ? Workspace : undefined
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

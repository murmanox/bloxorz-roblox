import { Block } from "../../block/block"
import { ReplicatedStorage, Workspace } from "@rbxts/services"
import { Board } from "../board/board"
import BaseTile from "./base-tile"
import { ButtonAction } from "../../../../shared/game/tiles/ButtonAction"
import { TileModel } from "./types"

const model = ReplicatedStorage.assets.tiles.toggle as TileModel
export default class ToggleTile extends BaseTile {
	// when toggled is true the tile will be visible and solid
	private toggled
	protected instance: TileModel

	constructor(board: Board, position: Vector3, initial: boolean) {
		super(board, position, model)
		this.toggled = initial
		this.instance = this.makeTile(this.out_position)
	}

	public tweenIn(): Promise<Model> {
		return super.tweenIn()
	}

	activate(action: ButtonAction) {
		switch (action) {
			case ButtonAction.Activate:
				this.toggle(true)
				break

			case ButtonAction.Deactivate:
				this.toggle(false)
				break

			default:
				this.toggle(!this.toggled)
		}
	}

	toggle(value: boolean) {
		this.toggled = value
		// change transparency I think
	}

	isLosingPosition(block: Block) {
		return !this.toggled
	}
}

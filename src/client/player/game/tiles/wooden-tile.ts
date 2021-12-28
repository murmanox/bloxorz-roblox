import { Block } from "../../block/block"
import { ReplicatedStorage } from "@rbxts/services"
import BaseTile from "./base-tile"
import { Board } from "../board/board"
import { TileModel } from "./types"

const model = ReplicatedStorage.assets.tiles.wooden as TileModel
export default class WoodenTile extends BaseTile {
	protected instance: TileModel

	constructor(board: Board, position: Vector3) {
		super(board, position, model)
		this.instance = this.makeTile(this.out_position)
	}

	onStepped(block: Block) {
		if (block.isStanding()) {
			const instance = this.instance
			const part = instance.IsA("BasePart") ? instance : instance.PrimaryPart!

			// break tile
			part.CanCollide = false
			part.Anchored = false
			part.ApplyAngularImpulse(new Vector3(1, 0, 0.25).mul(part.Mass / 10))
		}
	}

	isLosingPosition(block: Block) {
		return block.isStanding()
	}
}

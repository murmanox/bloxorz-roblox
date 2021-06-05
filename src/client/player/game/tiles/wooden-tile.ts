import Tile from "./tile"
import { Block } from "../block"

export default class WoodenTile extends Tile {
	private static colour = Color3.fromRGB(255, 106, 0)

	onStepped(block: Block) {
		if (block.isStanding()) {
			const instance = this.instance
			if (instance === undefined) return

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

	draw(position: Vector3, completed: Callback) {
		const tile_info = super.draw(position, completed, { colour: WoodenTile.colour })
		this.instance = tile_info.instance
		return tile_info
	}
}

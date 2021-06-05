import Tile from "./tile"
import { Block } from "../block"
import { Workspace } from "@rbxts/services"
import { v3 } from "shared/utility/vector3-utils"
import { ButtonAction } from "shared/game/tiles/tile-types"

const tile_size = new Vector3(1, 0.2, 1)
const tile_size_y = tile_size.mul(v3.up).div(2)
const tile_slide_offset = new Vector3(0, -13, 0)

export default class ToggleTile extends Tile {
	private static colour = Color3.fromRGB(105, 102, 92)

	// when toggled is true the tile will be visible and solid
	private toggled

	constructor(initial: boolean) {
		super()
		this.toggled = initial
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
		if (this.instance === undefined) {
			return
		}

		this.instance.Parent = this.toggled ? Workspace : undefined
	}

	isLosingPosition(block: Block) {
		return !this.toggled
	}

	draw(position: Vector3, completed: Callback) {
		const tile_out_position = position.add(tile_slide_offset)
		const instance = Tile.makeTile(tile_out_position, { colour: ToggleTile.colour })
		Tile.tweenTile(instance, position.sub(tile_size_y), () => {
			completed()
		})

		this.instance = instance

		return {
			instance: instance as BasePart | Model,
			show: (parent: Instance) => {
				this.toggle(this.toggled)
			},
			callback: (animate_out_callback: Callback) => {
				Tile.tweenTile(instance, tile_out_position, animate_out_callback)
			},
		}
	}
}

import { TweenService, Workspace } from "@rbxts/services"
import soundManager from "client/modules/sound-manager"
import tile_config from "shared/config/tile-config"
import { ButtonAction } from "shared/game/tiles/ButtonAction"
import { Math } from "shared/utility/math"
import { TweenPromise } from "shared/utility/tween"
import { v3 } from "shared/utility/vector3-utils"
import { Block } from "../../block/block"
import { Board } from "../board/board"
import { TileModel } from "./types"

const config = tile_config
const random = new Random()
const tile_size = new Vector3(1, 0.2, 1)
const tile_size_y = tile_size.mul(v3.up).div(2)
const tile_slide_offset = new Vector3(0, -13, 0)
const TWEEN_INFO = new TweenInfo(0.5)

let last_time = 0
export default abstract class BaseTile {
	protected model: TileModel

	protected abstract instance: TileModel
	protected in_position: Vector3
	protected out_position: Vector3
	protected board: Board

	constructor(board: Board, position: Vector3, model: TileModel) {
		this.board = board
		this.in_position = position.sub(tile_size_y)
		this.out_position = this.in_position.add(tile_slide_offset)
		this.model = model
	}

	public activate(action: ButtonAction) {}
	public onStepped(block: Block) {}

	public isLosingPosition(block: Block): boolean {
		return false
	}

	public isWinningPosition(block: Block): boolean {
		return false
	}

	public setParent(parent: Instance | undefined) {
		this.instance.Parent = parent
	}

	public tweenIn(): Promise<Model> {
		return new Promise<Model>((resolve) => {
			this.tweenTile(
				this.instance.PrimaryPart,
				this.in_position.sub(this.instance.PrimaryPart.PivotOffset.Position) // move pivot to out_position
			).andThen(() => {
				// play sound
				const current_time = tick()
				if (last_time - current_time < -0.05) {
					last_time = current_time
					soundManager.play("stone_impact", { PlaybackSpeed: Math.randomDecimal(0.9, 1.1, 3) })
				}
				resolve(this.instance)
			})
		})
	}

	public tweenOut(): Promise<void> {
		return this.tweenTile(
			this.instance.PrimaryPart,
			this.out_position.add(this.instance.PrimaryPart.PivotOffset.Position)
		)
	}

	protected makeTile(position: Vector3): TileModel {
		const part = this.model.Clone()
		part.PivotTo(new CFrame(position, position.add(part.PrimaryPart.CFrame.LookVector)))
		return part
	}

	// tweens a tile with a random delay before beginning
	protected tweenTile(tile: BasePart, position: Vector3): Promise<void> {
		const delay = random.NextNumber(config.tween_delay.min, config.tween_delay.max)
		const goal = {
			CFrame: new CFrame(position, position.add(tile.CFrame.LookVector)),
		}
		return new TweenPromise(tile, TWEEN_INFO, goal).delay(delay)
	}
}

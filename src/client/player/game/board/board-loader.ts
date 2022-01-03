import Signal from "@rbxts/good-signal"
import { BlockController } from "client/player/block/block-controller"
import { BlockFactory } from "client/player/block/block-factory"
import { LevelConfig } from "shared/config/levels/level-types"
import { Board } from "./board"
import { BoardSwapper } from "./board-swapper"
import { TileManager } from "./tile-manager"

// I kind of don't like that this class exists
export class BoardLoader {
	private tiles: TileManager
	private block_controller: BlockController
	private swapper: BoardSwapper

	public level_data?: LevelConfig
	public size = new Vector2()

	private on_load = new Signal()
	private on_unloaded = new Signal()
	private on_loaded = new Signal()
	private on_unload = new Signal()

	constructor(private board: Board) {
		this.swapper = new BoardSwapper(this, board)

		this.tiles = board.tiles
		this.block_controller = board.block_controller
	}

	public setLevel(level?: LevelConfig) {
		this.swapper.setTarget(level).updateBoard()
	}

	public reload() {
		this.swapper.resetBoard()
	}

	public load(level: LevelConfig): Promise<void> {
		this.level_data = level
		this.size = new Vector2(level.level_tiles[0].size(), level.level_tiles.size())
		this.tiles.setLevelTiles(level.tiles)

		print(`Loading level: ${level.name}`)

		return new Promise((resolve, reject, onCancel) => {
			this.on_load.fire()
			this.block_controller.setBlocks(BlockFactory.fromStartPositions(level.start_positions))

			// generate the board and spawn the player
			this.tiles.generate(level)
			this.tiles
				.load(this.size)
				.then(() => {
					this.block_controller.spawn()
				})
				.then(() => this.on_loaded.fire())
				.then(resolve)
		})
	}

	public unload(): Promise<void> {
		this.on_unload.fire()
		this.board.block_controller.despawn()
		return this.tiles.unload().then(() => this.on_unloaded.fire())
	}

	public onLoad(callback: () => void) {
		return this.on_load.connect(callback)
	}
	public onLoaded(callback: () => void) {
		return this.on_loaded.connect(callback)
	}
	public onUnload(callback: () => void) {
		return this.on_unload.connect(callback)
	}
	public onUnloaded(callback: () => void) {
		return this.on_unloaded.connect(callback)
	}
}

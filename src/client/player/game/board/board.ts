import Signal from "@rbxts/good-signal"
import { Block } from "client/player/block/block"
import { LevelConfig } from "shared/config/levels/level-types"
import { LevelData } from "types/interfaces/level-types"
import { ITile } from "types/interfaces/tile-types"
import { BlockController } from "../../block/block-controller"
import { Game } from "../game"
import { BoardLoader } from "./board-loader"
import { BoardLogic } from "./board-logic"
import { TileManager } from "./tile-manager"

export enum BoardState {
	Unloaded = "Unloaded",
	Unloading = "Unloading",
	Loaded = "Loaded",
	Loading = "Loading",
}

enum BoardEnums {
	EMPTY,
}

type OnStateChanged = [state: BoardState, old_state: BoardState]

export class Board {
	static EMPTY = BoardEnums.EMPTY

	private state: BoardState = BoardState.Unloaded
	public win = false
	public lose = false

	// class
	private board_logic = new BoardLogic()
	public tiles = new TileManager(this)
	private loader: BoardLoader
	public block_controller: BlockController

	// events
	private on_state_changed = new Signal<OnStateChanged>()

	constructor(public app: Game, public position: Vector3) {
		this.block_controller = new BlockController(this.app)
		this.loader = new BoardLoader(this)

		this.block_controller.move_finished.connect(() => this.check())

		const setState = (state: BoardState) => () => {
			this.win = this.lose = false
			this.setState(state)
		}

		this.loader.onLoad(setState(BoardState.Loading))
		this.loader.onLoaded(setState(BoardState.Loaded))
		this.loader.onUnload(setState(BoardState.Unloading))
		this.loader.onUnloaded(setState(BoardState.Unloaded))

		this.board_logic.onLose(() => {
			this.lose = true
		})

		this.board_logic.onWin(() => {
			this.win = true
		})
	}

	private setState(state: BoardState) {
		if (this.state === state) return

		const old_state = this.state
		this.state = state
		this.on_state_changed.fire(this.state, old_state)
	}

	public setLevel(level_data: LevelConfig | BoardEnums.EMPTY) {
		this.loader.setLevel(level_data === Board.EMPTY ? undefined : level_data)
	}

	// check all game logic to see if the player has won or lost
	public check() {
		return this.board_logic.check(this, this.block_controller, this.tiles)
	}

	public resetBoard() {
		this.loader.reload()
	}

	public getSize(): Vector2 {
		return this.loader.size
	}

	public getTile(x: number, y: number): ITile {
		return this.tiles.getTile(x, y)
	}

	public isLoaded(): boolean {
		return this.state === BoardState.Loaded
	}
	public isUnloaded(): boolean {
		return this.state === BoardState.Unloaded
	}

	public onStateChange(callback: VoidCallback<OnStateChanged>) {
		return this.on_state_changed.connect(callback)
	}
}

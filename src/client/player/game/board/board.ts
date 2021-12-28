import Signal from "@rbxts/good-signal"
import { LevelData } from "types/interfaces/level-types"
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

		const setState = (state: BoardState) => () => this.setState(state)
		this.loader.onLoad(setState(BoardState.Loading))
		this.loader.onLoaded(setState(BoardState.Loaded))
		this.loader.onUnload(setState(BoardState.Unloading))
		this.loader.onUnloaded(setState(BoardState.Unloaded))

		// this.loader.onUnload(() => this.block_controller.)
	}

	private setState(state: BoardState) {
		if (this.state === state) return

		const old_state = this.state
		this.state = state
		this.on_state_changed.fire(this.state, old_state)
	}

	public setLevel(level_data: LevelData | BoardEnums.EMPTY) {
		this.loader.setLevel(level_data === Board.EMPTY ? undefined : level_data)
	}

	// check all game logic to see if the player has won or lost
	public check() {
		const lose = this.board_logic.checkLoss(this.block_controller.blocks, this.tiles)
		if (lose) {
			//do lose stuff
			print("lose")
			return
		}

		const win = this.board_logic.checkWin(this.block_controller.blocks, this.tiles)
		if (win) {
			// do win stuff
			print("win")
			return
		}

		// check combine
		// run effects
	}

	public checkCombine() {}

	public runEffects() {}

	public resetBoard() {
		this.loader.reload()
	}

	public getSize(): Vector2 {
		return this.loader.size
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

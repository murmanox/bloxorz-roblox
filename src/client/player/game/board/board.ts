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
	public previous_checks = new Map<Block, Vector3[]>()

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

	public setLevel(level_data: LevelConfig | BoardEnums.EMPTY) {
		this.loader.setLevel(level_data === Board.EMPTY ? undefined : level_data)
	}

	// check all game logic to see if the player has won or lost
	public check(current_checks = new Map<Block, Vector3[]>()) {
		// Check if player has lost
		const lose = this.board_logic.checkLoss(this.block_controller.blocks, this.tiles)
		if (lose) {
			print("lose")
			return
		}

		// Check if player has won
		const win = this.board_logic.checkWin(this.block_controller.blocks, this.tiles)
		if (win) {
			print("win")
			return
		}

		// check combine
		this.block_controller.checkCombine()

		// run effects
		const promises: Promise<boolean>[] = []
		this.block_controller.blocks.forEach((block) => {
			const m = this.previous_checks.get(block)
			const n = current_checks.get(block)
			const tiles = block.getPositions().map((p) => this.getTile(p.X, p.Z))

			// Make sure blocks that were processed on previous checks don't get checked again.
			// This prevents buttons from being activated repeatedly when a different block moves.
			if (
				(m && m.every((pos) => block.getPositions().includes(pos))) ||
				(n && n.every((pos) => block.getPositions().includes(pos)))
			) {
				current_checks.set(block, block.getPositions())
				return
			}

			current_checks.set(block, block.getPositions())
			tiles.forEach((tile) => {
				return promises.push(tile.stepped(block))
			})
		})

		// Wait for all animations to finish
		Promise.all(promises)
			// Return a boolean that's true if the board needs to be checked again
			.then((res) => (res as boolean[]).some((v) => v))
			.then((check_again) => {
				// Check again if stepping on a tile has changed the board in some way. Such as toggling a tile or teleporting a block.
				if (check_again) {
					task.wait()
					this.check(current_checks)
				} else {
					this.previous_checks = current_checks
				}
			})
	}

	public checkCombine() {}

	public runEffects() {}

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

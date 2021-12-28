import { LevelData } from "types/interfaces/level-types"
import { Board } from "./board"
import { BoardLoader } from "./board-loader"

/**
 * Handles the logic for changing levels automatically
 */
export class BoardSwapper {
	private is_swapping = false
	private target_level?: LevelData
	private will_reset = false

	constructor(private loader: BoardLoader, private board: Board) {}

	public setTarget(level?: LevelData) {
		this.target_level = level
		return this
	}

	/**
	 * Force a reload of the board if the board is already loaded
	 */
	public resetBoard() {
		if (this.board.isLoaded()) {
			this.will_reset = true
			this.updateBoard()
		}
	}

	public updateBoard() {
		if (this.is_swapping) return
		this._updateBoard()
	}

	/**
	 * When the board is able to be updated and the current level doesn't match the level we want
	 * to display, unload the current board and load the target level.
	 */
	private _updateBoard() {
		if (
			(!this.target_level && this.board.isUnloaded()) ||
			(this.target_level === this.loader.level_data && this.board.isLoaded() && !this.will_reset)
		) {
			this.is_swapping = false
			return
		}

		this.will_reset = false
		this.is_swapping = true

		this.loader
			.unload()
			.then(() => {
				if (this.target_level) {
					return this.loader.load(this.target_level)
				}
			})
			.then(() => {
				this._updateBoard()
			})
	}
}

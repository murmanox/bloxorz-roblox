import { dbg } from "shared/utility/debug"
import { MoveDirection } from "types/interfaces/block-types"
import { Game } from "./game"

export class GameLogic {
	public moving = false
	private move_promise: Promise<any> = Promise.resolve()

	constructor(private app: Game) {}

	public onMove(direction: MoveDirection) {
		if (this.moving) return

		const controller = this.app.board.block_controller
		if (!controller.canMove()) return
		if (this.app.board.win || this.app.board.lose) return
		this.moving = true

		this.move_promise = controller
			.move(direction) // move block

			// check the board
			.then(() => this.app.board.check())

			// handle wins and losses
			.then(() => this.handleWinsAndLosses())
			.finally(() => (this.moving = false)) // Use finally here so player can still move if there's an error
	}

	private handleWinsAndLosses() {
		if (this.app.board.win) {
			return this.onWin()
		} else if (this.app.board.lose) {
			return this.onLose()
		}
	}

	public onWin() {
		print("win")
		this.app.board.block_controller.current_block?.fall()
		return Promise.delay(1).then(() => {
			this.app.board.resetBoard()
		})
	}

	public onLose() {
		print("lose")
		this.app.board.block_controller.despawn()
		return Promise.delay(1).then(() => {
			this.app.board.resetBoard()
		})
	}

	/**
	 * Cancel the current promise, stopping all animations and resetting the state back to defaults
	 */
	public onReset() {
		this.move_promise.cancel()
		dbg(`Reset. Moving: ${this.moving}`)
	}
}

import Signal from "@rbxts/good-signal"
import { Janitor } from "@rbxts/janitor"
import { flatten } from "shared/utility/array"
import { v3 } from "shared/utility/vector3-utils"
import { MoveDirection } from "types/interfaces/block-types"
import { DisplayArrow } from "../game/display-arrow"
import type { Game } from "../game/game"
import { PlayerInput } from "../game/player-input"
import { Block } from "./block"

const BLOCK_SIZE = 1
const arrow_offset = 0.15

const arrow_position_callback = (block: Block): Vector3 => {
	if (block.isStanding()) {
		return block.getPosition().add(new Vector3(0, BLOCK_SIZE * block.length - BLOCK_SIZE / 2, 0))
	} else {
		return block.getPosition().add(new Vector3(0, BLOCK_SIZE / 2, 0))
	}
}

const action_direction_map = {
	up: v3.back,
	down: v3.forward,
	left: v3.left,
	right: v3.right,
}

export class BlockController {
	public player_input: PlayerInput

	public blocks: Block[] = []
	public current_block?: Block
	public arrow: DisplayArrow
	private janitor = new Janitor()

	private is_moving = false

	public move_finished = new Signal()

	constructor(private app: Game) {
		this.player_input = app.player_input

		this.arrow = new DisplayArrow()
		this.janitor.Add(this.arrow, "destroy")

		// Connect to input signals
		this.janitor.Add(this.player_input.onReset(() => this.app.board.resetBoard()))
		this.janitor.Add(this.player_input.onSwap(() => this.nextBlock()))
	}

	public setBlocks(blocks: Block[]) {
		this.blocks = blocks
		this.current_block = blocks.size() > 0 ? blocks[0] : undefined
	}

	public nextBlock() {
		if (this.blocks.size() <= 1) return
		const block_index = this.blocks.findIndex((block) => block === this.current_block)
		const index = (block_index + 1) % this.blocks.size()
		this.current_block = this.blocks[index]
	}

	/**
	 * Split a single block into multiple smaller blocks
	 * @param block
	 * @param positions
	 * @returns A promise that's resolved when the new block has been created
	 */
	public split(block: Block, positions: BoardPosition[]) {
		return block
			.blinkOut()
			.then(() => {
				const new_blocks = block.split(positions)
				this.blocks.remove(this.blocks.findIndex((find_block) => find_block === block))
				this.blocks = [...this.blocks, ...new_blocks]
				this.current_block = new_blocks[0]
				return Promise.all(new_blocks.map((block) => block.blinkIn()))
			})
			.then(() => block.destroy())
	}

	/**
	 * Combine multiple blocks together into a single block
	 * @param blocks The blocks to combine
	 */
	public combine(blocks: Block[]) {
		// Create a new block from the passed blocks
		const new_block = new Block(flatten(blocks.map((b) => b.positions))).show()

		// Add the new block to the BlockController
		this.blocks.push(new_block)

		// Replace the current block if it's being merged into a new block
		if (blocks.includes(this.current_block!)) {
			this.current_block = new_block
		}

		// Remove merged blocks from BlockController and destroy
		for (const block of blocks) {
			this.blocks.remove(this.blocks.indexOf(block))
			block.destroy()
		}
	}

	public spawn() {
		return Promise.all(this.blocks.map((block) => block.spawn(this.app.board.position)))
	}

	public despawn() {
		this.blocks.forEach((block) => block.fall())
	}

	/**
	 *
	 * @param direction
	 * @returns
	 */
	public move(direction: MoveDirection): Promise<any> {
		// Reject here to prevent the board being checked unnecessarily
		if (!this.canMove()) return Promise.reject("A Block inside this BlockController is currently moving")
		this.is_moving = true

		return this.current_block!.move(action_direction_map[direction]).finally(() => {
			this.is_moving = false
		})
	}

	public canMove() {
		return this.current_block && !this.is_moving
	}
}

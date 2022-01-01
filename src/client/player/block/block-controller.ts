import Signal from "@rbxts/good-signal"
import { Janitor } from "@rbxts/janitor"
import { v3 } from "shared/utility/vector3-utils"
import { DisplayArrow } from "../game/display-arrow"
import type { Game } from "../game/game"
import { PlayerInput } from "../game/player-input"
import { Block } from "./block"

const left_vector = v3.left
const right_vector = v3.right
const forward_vector = v3.back
const back_vector = v3.forward

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
	up: forward_vector,
	down: back_vector,
	left: left_vector,
	right: right_vector,
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
		this.janitor.Add(this.player_input.onMove((dir) => this.onMove(dir)))
		this.janitor.Add(this.player_input.onReset(() => this.app.board.resetBoard()))
		this.janitor.Add(this.player_input.onSwap(() => this.nextBlock()))
	}

	public setBlocks(blocks: Block[]) {
		this.blocks = blocks
		this.current_block = blocks.size() > 0 ? blocks[0] : undefined
	}

	private onMove(action_name: keyof typeof action_direction_map) {
		if (!this.current_block || this.is_moving) return
		this.is_moving = true

		const direction = action_direction_map[action_name as keyof typeof action_direction_map]
		this.current_block.move(direction).finally(() => {
			this.is_moving = false
			this.move_finished.fire()
		})
	}

	public nextBlock() {
		if (this.blocks.size() <= 1) return
		const block_index = this.blocks.findIndex((block) => block === this.current_block)
		const index = (block_index + 1) % this.blocks.size()
		this.current_block = this.blocks[index]
	}

	// check all blocks to see if they can be combined
	public checkCombine() {
		// this would probably be cool if I could check up, down, left and right on the board

		if (!this.current_block) return
		const current_block = this.current_block

		// standing blocks can't be combined
		if (current_block.isStanding()) return

		for (const other_block of this.blocks) {
			// don't compare a block against itself
			if (other_block === current_block) continue
			if (other_block.isStanding()) continue

			const block = current_block // fix later
			const positions = [...block.positions, ...other_block.positions]

			// TODO: prevent overlapping (not an issue unless >2 blocks)

			for (const position of current_block.positions) {
				for (const other_position of other_block.getPositions()) {
					// check if block is next to another block
					if (position.sub(other_position).Magnitude !== 1) continue

					// check that other block is along same axis
					const all_x_equal = positions.map((v) => v.X).every((x, _, arr) => x === arr[0])
					const all_z_equal = positions.map((v) => v.Z).every((z, _, arr) => z === arr[0])

					// position doesn't follow direction of current block
					if (!all_x_equal && !all_z_equal) {
						continue
					}

					// combine blocks
					const new_block = current_block.combine(other_block)

					// remove current and other block from the blocks array and replace with the combined block
					this.blocks.remove(this.blocks.findIndex((find_block) => find_block === current_block))
					this.blocks.remove(this.blocks.findIndex((find_block) => find_block === other_block))

					current_block.destroy(0)
					other_block.destroy(0)

					this.blocks.push(new_block)
					this.current_block = new_block

					// new block may be able to combine into another block
					return
				}
			}
		}

		// if (this.blocks.size() > 1) {
		// 	this.arrow.show()
		// } else {
		// 	this.arrow.hide()
		// }
	}

	public spawn() {
		return Promise.all(this.blocks.map((block) => block.spawn(this.app.board.position)))
	}

	public despawn() {
		print("despawn")
		this.blocks.forEach((block) => block.destroy())
	}
}

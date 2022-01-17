import Signal from "@rbxts/good-signal"
import { Block } from "client/player/block/block"
import { BlockController } from "client/player/block/block-controller"
import { flatten } from "shared/utility/array"
import { v3 } from "shared/utility/vector3-utils"
import { Board } from "./board"
import { TileManager } from "./tile-manager"

export class BoardLogic {
	private on_win = new Signal()
	private on_lose = new Signal()

	/** Keeps track of where blocks were last time the board was checked to prevent activating tile effects multiple times */
	private previous_checks = new Map<Block, Vector3[]>()
	private current_checks = new Map<Block, Vector3[]>()

	public checkWin(blocks: Block[], tiles: TileManager): boolean {
		if (blocks.size() !== 1) {
			return false
		}

		const block = blocks[0]
		const tiles_touching = block.getPositions().map((position) => tiles.getTile(position.X, position.Z))

		// all touched tiles are in a winning state
		if (tiles_touching.every((tile) => tile.isWinningPosition(block))) {
			return true
		}
		return false
	}

	public checkLoss(blocks: Block[], tiles: TileManager): boolean {
		for (const block of blocks) {
			const tiles_touching = block.getPositions().map((position) => tiles.getTile(position.X, position.Z))

			// at least one of the tiles is a losing position
			if (tiles_touching.some((tile) => tile.isLosingPosition(block))) {
				return true
			}
		}
		return false
	}

	/**
	 * Checks whether any of the passed blocks can be combined into larger blocks
	 * @param blocks The blocks to check for combines
	 * @returns Arrays of blocks that can be combined together
	 */
	public checkCombine(blocks: Block[]): Block[][] {
		blocks = [...blocks]
		print("check combine", blocks.map((b) => b.id).join(" "))

		const directions = [v3.right, v3.left, v3.forward, v3.back]
		const combined_map = new Map<Block, Block[]>()
		const combined_blocks_array: Block[][] = []

		// Map all blocks to their positions for easy indexing
		const map_positions_to_block = new Map<Vector3, Block>()
		blocks.forEach((block) => block.getPositions().forEach((pos) => map_positions_to_block.set(pos, block)))

		while (blocks.size() > 0) {
			const block = blocks.shift() as Block
			const to_check = flatten(
				directions.map((dir) => block.getPositions().map((pos) => pos.add(dir)))
			).filter((v) => !block.getPositions().includes(v))

			// Check if there are any adjacencies
			const adjacency = to_check.find(
				(pos) => map_positions_to_block.get(pos) && map_positions_to_block.get(pos) !== block
			)

			// No adjacency found
			if (!adjacency) {
				continue
			}

			print("Adjacency found")
			const other_block = map_positions_to_block.get(adjacency)!
			blocks.remove(blocks.indexOf(other_block))

			const block_array = combined_map.get(other_block)
			if (!block_array) {
				print("creating new combined block", block.id, other_block.id)
				const block_array = [block, other_block]
				combined_blocks_array.push(block_array)
				combined_map.set(block, block_array)
				combined_map.set(other_block, block_array)
			} else {
				print("adding to existing block", block.id)
				block_array.push(block)
				combined_map.set(block, block_array)
			}
		}

		return combined_blocks_array
	}

	public check(board: Board, block_controller: BlockController, tiles: TileManager) {
		const checkBoard = () => {
			// Check if player has lost
			if (this.checkLoss(block_controller.blocks, tiles)) {
				this.on_lose.fire()
				return Promise.resolve()
			}

			// Check if player has won
			if (this.checkWin(block_controller.blocks, tiles)) {
				this.on_win.fire()
				return Promise.resolve()
			}

			// check combine
			this.checkCombine(block_controller.blocks).forEach((r) => block_controller.combine(r))

			// run effects
			// Maybe this should be in a separate class / method?
			const promises: Promise<boolean>[] = []
			block_controller.blocks.forEach((block) => {
				const m = this.previous_checks.get(block)
				const n = this.current_checks.get(block)
				const block_positions = block.getPositions()
				const tiles = block_positions.map((p) => board.getTile(p.X, p.Z))

				// Make sure blocks that were processed on previous checks don't get checked again.
				// This prevents buttons from being activated repeatedly when a different block moves.
				if (
					(m && m.every((pos) => block_positions.includes(pos))) ||
					(n && n.every((pos) => block_positions.includes(pos)))
				) {
					// print(`block was checked previously (${block.getPositions().join("), (")})`)
					this.current_checks.set(block, block.getPositions())
					return
				}

				// Block hasn't been checked before
				this.current_checks.set(block, block_positions)
				tiles.forEach((tile) => promises.push(tile.stepped(block)))
			})

			// Wait for all animations to finish
			return Promise.fold(promises, (a, v) => a || v, false).then((res) => {
				return res ? Promise.reject() : Promise.resolve()
			})
		}

		print("Starting checks")
		return Promise.retry(() => checkBoard(), math.huge).then(() => {
			print("End checks")
			this.previous_checks = this.current_checks
		})
	}

	public onWin(callback: Callback) {
		return this.on_win.connect(callback)
	}

	public onLose(callback: Callback) {
		return this.on_lose.connect(callback)
	}
}

import { Janitor } from "@rbxts/janitor"
import { ContextActionService, TweenService, UserInputService, Workspace } from "@rbxts/services"
import game_config from "shared/config/game-config"
import { levels } from "shared/level/level-config"
import { v3 } from "shared/utility/vector3-utils"
import type { Block } from "./block"
import { BlockFactory } from "./block"
import { Board } from "./board"
import { PlayerController } from "./player-controller"
import type { Tile } from "./tiles"

export enum GameState {
	Loading = "Loading",
	Waiting = "Waiting", // waiting for input
	Moving = "Moving",
	Win = "Win",
	Lose = "Lose",
}

type LevelCompleteCallback = (index: number) => void

const config = game_config
export class Game {
	private janitor = new Janitor<{ move_began: RBXScriptConnection }>()

	// TODO: I should probably make a new board each time I load a level, it will be much cleaner
	public board: Board
	public player: PlayerController

	public state: GameState
	public scale = config.scale
	public board_position = config.board_position

	private block_factory = new BlockFactory(this)

	// exposed events
	public level_finished: RBXScriptSignal

	// event implementations
	private events = {
		level_finished: new Instance("BindableEvent"),
	}

	constructor() {
		// init events
		this.level_finished = this.events.level_finished.Event
		this.board = new Board(this.board_position)

		this.state = GameState.Loading

		// initialise the player
		const blocks: Block[] = []
		this.board.start_positions.forEach((start) => {
			blocks.push(
				this.block_factory.createBlock(
					new Vector3(start.column, 0, start.row),
					start.direction,
					start.length
				)
			)
		})

		this.player = new PlayerController(this, blocks)
		this.player.onMoveCallback = (block, direction) => {
			this.onPlayerMoved(direction)
		}

		this.janitor.Add(
			this.player.move_began.Connect(() => {
				this.onPlayerMoveBegan()
			}),
			"Disconnect",
			"move_began"
		)

		ContextActionService.BindAction(
			"reset",
			(name, state, input) => {
				if (state === Enum.UserInputState.Begin) {
					this.resetLevel()
				}
			},
			false,
			Enum.KeyCode.R
		)
	}

	public initialise() {
		// maybe use a promise here?
		ContextActionService.BindAction(
			"next_level",
			() => {
				this.events.level_finished.Fire()
			},
			false,
			Enum.KeyCode.P
		)
		// coroutine.wrap(() => {
		// 	this.board.draw()
		// 	this.state = GameState.Waiting
		// })()
	}

	// check all game logic to see if the player has won or lost
	public check() {
		const blocks = this.player.blocks

		let lose = false
		let win = true

		// need to check if all blocks are in a winning position or if one is in a losing position
		for (const block of blocks) {
			const tiles_touching = block
				.getPositions()
				.map((position) => this.board.getTile(position.X, position.Z))

			const is_losing_position = tiles_touching.some((tile) => {
				return tile === 0 ? true : tile.isLosingPosition(block)
			})

			const is_winning_position = tiles_touching.every((tile) => {
				return tile === 0 ? false : tile.isWinningPosition(block)
			})

			lose = lose || is_losing_position
			win = win && is_winning_position

			if (is_winning_position) {
				block.fall(v3.zero)
			} else if (is_losing_position) {
				// fall at an angle depending on how they lose I guess
			}
		}

		if (lose) {
			this.state = GameState.Lose
		} else if (win) {
			this.state = GameState.Win
		} else {
			this.state = GameState.Waiting
		}

		if (lose) {
			this.onPlayerLose()
		} else if (win) {
			this.onPlayerWin()
		}
	}

	public onPlayerMoveBegan() {
		this.state = GameState.Moving
	}

	// Called when the player moves a block. Calls the onStepped method for tiles that the current block is touching.
	public onPlayerMoved(direction: Vector3) {
		const current_block = this.player.current_block
		const tiles_touching = current_block
			.getPositions()
			.map((position) => this.board.getTile(position.X, position.Z))

		// handle stepping on tiles
		tiles_touching.forEach((tile) => {
			if (tile) {
				tile.onStepped(current_block)
			}
		})

		// handle falling here
		if (current_block.isStanding()) {
			// will only be touching one tile
			const tile = tiles_touching[0]

			// TODO: implement unique falling mechanics per tile, such as WoodenTile and EndTile
			if (!tile || tile.isLosingPosition(current_block)) {
				current_block.fall(direction)
			}
		} else {
			const testLosing = (tile: 0 | Tile) => {
				return tile === 0 || tile.isLosingPosition(current_block)
			}

			// check if both tiles are in losing positions
			const both_losing = tiles_touching.every(testLosing)

			if (both_losing) {
				current_block.fall(direction)
			} else {
				// check if only one tile is in a losing position
				const one_losing = tiles_touching.some(testLosing)
				if (one_losing) {
					const current_positions = current_block.getPositions()

					const positions_total = current_positions.reduce(
						(total, position) => total.add(position),
						v3.zero
					)
					const losing_pos = current_positions.find((position) => {
						return testLosing(this.board.getTile(position.X, position.Z))
					}) as Vector3

					// losing position will be 1 apart from a non-losing one, so we can subtract it twice
					// to get the direction that the losing position is relative to the non-losing one.
					const fall_direction = positions_total.sub(losing_pos.mul(2)).mul(-1)
					current_block.fall(fall_direction)
				}
			}
		}

		this.check()
	}

	public onPlayerLose() {
		this.resetLevel()
	}

	private onPlayerWin() {
		this.board.unloadBoard()
		this.events.level_finished.Fire()
	}

	public setLevel(index: number, level_complete_callback: LevelCompleteCallback) {
		print(`Loading level ${index}.`)
		this.state = GameState.Loading
		this.board.setLevel(levels[index])

		this.player.destroy()

		// temporary
		const blocks: Block[] = []

		// create the blocks that will be controlled by the player
		this.board.start_positions.forEach((start) => {
			blocks.push(
				this.block_factory.createBlock(
					new Vector3(start.column, 0, start.row),
					start.direction,
					start.length
				)
			)
		})

		// TODO: animate player to fall on board
		// initialise the player
		this.player = new PlayerController(this, blocks)
		this.player.onMoveCallback = (block, direction) => {
			this.onPlayerMoved(direction)
		}

		this.janitor.Add(
			this.player.move_began.Connect(() => {
				this.onPlayerMoveBegan()
			}),
			"Disconnect",
			"move_began"
		)

		this.board.draw()
		this.state = GameState.Waiting
		const c = this.level_finished.Connect(() => {
			print(`Finished level ${index}`)
			c.Disconnect()
			level_complete_callback(index)
		})
	}

	public resetLevel() {
		this.state = GameState.Loading
		this.player.destroy()

		// temporary
		const blocks: Block[] = []

		// initialise the board
		this.board.resetBoard()

		// create the blocks that will be controlled by the player
		this.board.start_positions.forEach((start) => {
			blocks.push(
				this.block_factory.createBlock(
					new Vector3(start.column, 0, start.row),
					start.direction,
					start.length
				)
			)
		})

		// TODO: animate player to fall on board
		// initialise the player
		this.player = new PlayerController(this, blocks)
		this.player.onMoveCallback = (block, direction) => {
			this.onPlayerMoved(direction)
		}

		this.janitor.Add(
			this.player.move_began.Connect(() => {
				this.onPlayerMoveBegan()
			}),
			"Disconnect",
			"move_began"
		)

		this.state = GameState.Waiting
	}
}

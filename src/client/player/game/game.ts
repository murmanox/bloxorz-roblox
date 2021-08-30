import { Janitor } from "@rbxts/janitor"
import { ContextActionService } from "@rbxts/services"
import game_config from "shared/config/game-config"
import { LevelData } from "shared/level/level-config"
import Signal from "shared/module/Signal"
import { v3 } from "shared/utility/vector3-utils"
import { settings } from "../settings/keybinds"
import { BlockFactory } from "./block"
import { Board } from "./board"
import { PlayerController } from "./player-controller"
import { TeleporterTile, Tile } from "./tiles"

export enum GameState {
	Loading = "Loading",
	Waiting = "Waiting", // waiting for input
	Moving = "Moving",
	Win = "Win",
	Lose = "Lose",
}

type LevelLoadingCallback = (height: number, width: number) => void
type LevelCompleteCallback = Callback

type JanitorProps = {
	move_began: RBXScriptConnection
	level_finished: RBXScriptConnection
}

const config = game_config
export class Game {
	private janitor = new Janitor<JanitorProps>()

	// TODO: I should probably make a new board each time I load a level, it will be much cleaner
	public board?: Board
	public player?: PlayerController // player should probably be a member of board, game handles movement

	private current_level?: LevelData
	public state: GameState
	public scale = config.scale
	public board_position = config.board_position

	private block_factory = new BlockFactory(this)

	private level_complete_callback?: LevelCompleteCallback // delete this

	// exposed events
	public level_loading
	public player_moved
	public player_died
	public teleporter_used
	public button_pressed
	public tile_broken
	public level_finished

	// use this instead
	public events2 = {
		level: {
			finished: new Signal<(level: number, moves: number) => void>(),
			loaded: new Signal<(level: number) => void>(),
			restarted: new Signal<(level: number) => void>(),
		},

		player: {
			moved: new Signal(),
			died: new Signal(),
		},
	}

	// event implementations
	private events = {
		level_loading: new Instance("BindableEvent") as BindableEvent<LevelLoadingCallback>,
		player_moved: new Instance("BindableEvent") as BindableEvent<Callback>,
		player_died: new Instance("BindableEvent") as BindableEvent<Callback>,
		teleporter_used: new Instance("BindableEvent") as BindableEvent<Callback>,
		button_pressed: new Instance("BindableEvent") as BindableEvent<Callback>,
		tile_broken: new Instance("BindableEvent") as BindableEvent<Callback>,
		level_finished: new Instance("BindableEvent") as BindableEvent<LevelCompleteCallback>,
	}

	constructor() {
		// init events
		this.level_loading = this.events.level_loading.Event
		this.level_finished = this.events.level_finished.Event
		this.player_moved = this.events.player_moved.Event
		this.player_died = this.events.player_died.Event // TODO: implement
		this.teleporter_used = this.events.teleporter_used.Event // TODO: implement
		this.button_pressed = this.events.button_pressed.Event // TODO: implement
		this.tile_broken = this.events.tile_broken.Event // TODO: implement

		// add events to janitor for cleanup
		for (const [_, event] of pairs(this.events)) this.janitor.Add(event)

		this.state = GameState.Loading

		ContextActionService.BindAction(
			"reset",
			(name, state, input) => {
				if (state === Enum.UserInputState.Begin) {
					this.resetLevel()
				}
			},
			false,
			...settings.keybinds.reset
		)

		// for debugging
		ContextActionService.BindAction(
			"next_level",
			() => {
				this.events.level_finished.Fire()
			},
			false,
			Enum.KeyCode.P
		)
	}

	// check all game logic to see if the player has won or lost
	public check() {
		if (!this.player) return
		if (!this.board) return

		const blocks = this.player.blocks

		let lose = false
		let win = true

		// need to check if all blocks are in a winning position or if one is in a losing position
		for (const block of blocks) {
			const tiles_touching = block
				.getPositions()
				.map((position) => this.board!.getTile(position.X, position.Z))

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
	public onPlayerMoveFinished(direction: Vector3) {
		if (!this.player) return
		if (!this.board) return

		// update stats
		this.events.player_moved.Fire()

		const current_block = this.player.current_block
		const tiles_touching = current_block
			.getPositions()
			.map((position) => this.board!.getTile(position.X, position.Z))

		// handle stepping on tiles
		for (const tile of tiles_touching) {
			if (tile) {
				// temporary workaround to get teleporter working
				// I should make the board handle this instead of the game ??
				if (tile instanceof TeleporterTile && tile.isActivated(current_block)) {
					this.onPlayerTeleport()
					this.player.splitBlock(current_block, tile.targets)
				}
				tile.onStepped(current_block)
			}
		}

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
						return testLosing(this.board!.getTile(position.X, position.Z))
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

	public onPlayerTeleport() {
		this.events.teleporter_used.Fire()
	}

	public onPlayerLose() {
		this.resetLevel()
	}

	private onPlayerWin() {
		if (this.board) {
			this.board.unloadBoard()
			this.events.level_finished.Fire()
		}
	}

	private createPlayer(level: LevelData): Promise<PlayerController> {
		return new Promise((resolve, reject, onCancel) => {
			const player = new PlayerController(
				this,
				this.block_factory.fromStartPositions(level.start_positions)
			)
			player.onMoveCallback = (block, direction) => {
				this.onPlayerMoveFinished(direction)
			}

			this.janitor.Add(
				player.move_began.Connect(() => {
					this.onPlayerMoveBegan()
				}),
				"Disconnect",
				"move_began"
			)

			resolve(player)
		})
	}

	public async loadLevel(level: LevelData, level_complete_callback: LevelCompleteCallback) {
		print(`Loading level: ${level.name}.`)

		this.state = GameState.Loading
		this.level_complete_callback = level_complete_callback
		this.current_level = level

		if (this.player) this.player.destroy()
		if (this.board) this.board.destroy()

		this.board = new Board(this.board_position, level)

		// fire event before draw call as draw is currently asyncronous
		this.events.level_loading.Fire(this.board.height, this.board.width)
		this.board.draw()

		// spawn player after the board has been animated in
		this.createPlayer(level).then((result) => {
			this.player = result
			this.state = GameState.Waiting
		})

		this.janitor.Add(
			this.level_finished.Connect(() => {
				if (this.level_complete_callback) {
					print(`Finished level ${level.name}`)
					this.level_complete_callback()
				}
			}),
			"Disconnect",
			"level_finished"
		)
	}

	public exitLevel() {
		this.unloadLevel()
	}

	public unloadLevel() {
		this.state = GameState.Loading
		this.player?.destroy()
		this.board?.destroy()
		this.level_complete_callback = undefined
		this.janitor.Remove("level_finished")
	}

	public resetLevel() {
		if (!this.board) return
		if (!this.player) return
		if (!this.current_level) return
		print("resetting level")

		this.loadLevel(this.current_level, this.level_complete_callback!)
	}

	public destroy() {
		this.janitor.Cleanup()
	}
}

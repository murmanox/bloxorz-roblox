import { ContextActionService, RunService, UserInputService } from "@rbxts/services"
import game_config from "shared/config/game-config"
import levels from "shared/config/levels"
import { Board, BoardState } from "./board/board"
import { PlayerInput } from "./player-input"

export enum GameState {
	Unloaded = "Unloaded",
	Loading = "Loading",
	Waiting = "Waiting",
	Moving = "Moving",
	Win = "Win",
	Lose = "Lose",
}

const config = game_config
export class Game {
	public player_input = new PlayerInput()

	public board: Board
	private current_level = 0 // get this from profileservice
	public scale = config.scale

	/** Unused, maybe remove? */
	public state = GameState.Unloaded
	public is_loaded = false
	public player_has_won = false

	constructor() {
		this.board = new Board(this, config.board_position)

		this.board.onStateChange((state) => {
			if (state === BoardState.Loaded) {
				this.is_loaded = true
			} else {
				this.is_loaded = false
			}
		})

		RunService.RenderStepped.Connect((dt) => this.update(dt))

		// for debugging
		ContextActionService.BindAction(
			"next_level",
			(name, state, input) => {
				if (state === Enum.UserInputState.Begin) {
					const level = UserInputService.IsKeyDown(Enum.KeyCode.LeftShift)
						? this.current_level - 1
						: this.current_level + 1
					if (levels[level]) {
						this.loadLevel(level)
					}
				}
			},
			false,
			Enum.KeyCode.P
		)
	}

	public loadLevel(index: number) {
		this.current_level = index
		this.board.setLevel(levels[this.current_level])
	}

	public startGame(level?: number) {
		this.loadLevel(level ?? this.current_level)
	}

	public stopGame() {
		this.board.setLevel(Board.EMPTY)
	}

	private update(dt: number) {
		if (this.player_has_won) {
			// handle winning
			return
		}

		// check if the game can accept input
		if (this.is_loaded) {
			this.player_input.update(dt)
		}
	}
}

/**
 * on update => check input, move player, (check board, run effects, repeat)
 */

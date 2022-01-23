import { ContextActionService, RunService, UserInputService } from "@rbxts/services"
import game_config from "shared/config/board-config"
import levels from "shared/config/levels"
import { Board, BoardState } from "./board/board"
import { GameLogic } from "./game-logic"
import { PlayerInput } from "./player-input"

const config = game_config
export class Game {
	public player_input = new PlayerInput()
	private logic = new GameLogic(this)

	public board: Board
	private current_level = 0 // get this from profileservice
	public scale = config.scale

	public is_loaded = false
	public win = false
	public lose = false

	constructor() {
		this.board = new Board(this, config.position)

		this.player_input.onMove((dir) => this.logic.onMove(dir))
		this.player_input.onReset(() => this.logic.onReset())

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
		// check if the game can accept input
		if (this.is_loaded) {
			this.player_input.checkMovement()
		}
	}
}

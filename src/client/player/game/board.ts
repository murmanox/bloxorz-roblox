import { Janitor } from "@rbxts/janitor"
import { UserInputService, Workspace } from "@rbxts/services"
import { CustomTile, LevelData, levels } from "shared/level/level-config"
import { generator } from "shared/utility/generators"
import { inRange } from "shared/utility/math"
import { ButtonTile, EndTile, Tile, ToggleTile, VerticalButtonTile, WoodenTile } from "./tiles"

enum BoardState {
	Loaded = "loaded",
	Loading = "loading",
}

// hardcoded for now
const level_data = levels[2]

// temporary
type LoadingCallback = (level: typeof level_data) => void

// TODO: Board really should be where the player's blocks are stored
export class Board {
	// Keeps a reference to all parts generated in the draw method and it used to automatically clean them up
	private level_janitor = new Janitor()

	// I map to typeof Tile instead of an instance of Tile to allow for easier editing of individual tiles
	// via buttons or adding targets for teleporters
	private readonly default_tiles = new Map<string, typeof Tile>([
		["w", WoodenTile],
		["1", Tile],
		["2", EndTile],
	])
	private tiles = new Map<string, typeof Tile | CustomTile>()

	private state: BoardState = BoardState.Loading
	private tile_count = new Instance("IntValue")
	private instance_callbacks: Callback[] = []
	public width: number
	public height: number

	public level_tiles!: string[]
	public start_positions!: typeof level_data.start_positions

	public tile_class_array: (Tile | 0)[][] = []

	public loading: RBXScriptSignal<LoadingCallback>
	public unloading: RBXScriptSignal<LoadingCallback>
	private events = {
		loading: new Instance("BindableEvent") as BindableEvent<LoadingCallback>,
		unloading: new Instance("BindableEvent") as BindableEvent<LoadingCallback>,
	}

	constructor(private position: Vector3) {
		// init level size
		this.width = this.level_tiles[0].size()
		this.height = this.level_tiles.size()

		// init events
		this.loading = this.events.loading.Event
		this.unloading = this.events.unloading.Event

		let combined_tile_array: [string, typeof Tile | CustomTile][] = [...this.default_tiles]
		if (level_data.tiles) {
			combined_tile_array = [...this.default_tiles, ...level_data.tiles]
		}
		this.tiles = new Map<string, typeof Tile | CustomTile>(combined_tile_array)

		UserInputService.InputBegan.Connect((input) => {
			if (input.KeyCode === Enum.KeyCode.R && input.UserInputState === Enum.UserInputState.Begin) {
				this.resetBoard()
			}
		})

		// TODO: Fire this event on level load
		delay(1, () => {
			this.events.loading.Fire(level_data)
		})
	}

	public setLevel(level: LevelData) {
		this.width = level.level_tiles[0].size()
		this.height = level.level_tiles.size()
		this.tile_class_array = []
		this.level_tiles = level.level_tiles
		this.start_positions = level.start_positions
		let combined_tile_array: [string, typeof Tile | CustomTile][] = [...this.default_tiles]
		if (level.tiles) {
			combined_tile_array = [...this.default_tiles, ...level.tiles]
		}
		this.tiles = new Map<string, typeof Tile | CustomTile>(combined_tile_array)
		this.unloadBoard()
	}

	public getTile(x: number, y: number): Tile | 0 {
		// x or y is out of range of the board
		if (!inRange(x, 0, this.width - 1) || !inRange(y, 0, this.height - 1)) {
			return 0
		}

		return this.tile_class_array[y][x]
	}

	public draw() {
		// clear the board if it's already been drawn
		this.level_janitor.Cleanup()

		// generate Tile objects from level_tiles data
		this.level_tiles.forEach((tile_string) => {
			const arr = [...tile_string]

			this.tile_class_array.push(
				// convert the string values into tile objects
				arr.map((tile_character) => {
					const tile = this.tiles.get(tile_character)

					if (tile === undefined) {
						return 0
					}

					if ("button" in tile) {
						return new ButtonTile(this, tile.button!.targets, tile.button!.action)
					}

					if ("vertical_button" in tile) {
						return new VerticalButtonTile(this, tile.vertical_button!.targets)
					}

					if ("toggle" in tile) {
						return new ToggleTile(tile.toggle!.initial)
					}

					return new (tile as typeof Tile)()
				})
			)
		})

		// used to keep track of currently animating tiles
		const c = new Instance("IntValue")
		const e = new Instance("BindableEvent")

		const connection = c.Changed.Connect((value) => {
			if (value === 0) {
				e.Fire()
				connection.Disconnect()
			}
		})

		for (const [row, column, tile] of generator.array2d(this.tile_class_array)) {
			if (tile) {
				c.Value += 1
				const x = this.position.X + column - 1
				const y = this.position.Y
				const z = this.position.Z + row - 1

				// create tile instance and animate into position
				const draw_result = tile.draw(new Vector3(x, y, z), () => {
					this.tile_count.Value += 1
					c.Value -= 1
				})
				draw_result.show(Workspace)

				// add to callbacks array to be animated out later
				this.instance_callbacks.push(() => {
					draw_result.callback(() => {
						this.tile_count.Value -= 1
					})
				})

				this.level_janitor.Add(draw_result.instance)
			}
		}

		// wait until all tiles are finished animating then continue
		e.Event.Wait()
		this.state = BoardState.Loaded
	}

	/**
	 * Used to reset the board back to its initial state.
	 */
	public resetBoard() {
		if (this.state === BoardState.Loading) return
		this.state = BoardState.Loading

		// delete all saved Tiles
		this.tile_class_array = []

		// redraw the board and generated Tile objects
		print("unloading")
		this.unloadBoard()
		print("unloaded")
		this.draw()
		print("drawn")
	}

	public unloadBoard() {
		print("unload called")
		const e = new Instance("BindableEvent")

		// TODO: clean this up !!!
		const c = this.tile_count.Changed.Connect((count) => {
			if (count === 0) {
				// tiles have finished unloading, continue the script
				e.Fire()
				c.Disconnect()
			}
		})

		// animate board out
		this.instance_callbacks.forEach((callback) => {
			callback()
		})
		this.instance_callbacks = []

		if (this.tile_count.Value > 0) {
			e.Event.Wait()
		} else {
			c.Disconnect()
		}
	}
}

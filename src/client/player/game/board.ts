import { Janitor } from "@rbxts/janitor"
import { UserInputService, Workspace } from "@rbxts/services"
import { CustomTile, LevelData, levels } from "shared/level/level-config"
import { generator } from "shared/utility/generators"
import { inRange } from "shared/utility/math"
import {
	ButtonTile,
	EndTile,
	TeleporterTile,
	Tile,
	ToggleTile,
	VerticalButtonTile,
	WoodenTile,
} from "./tiles"

enum BoardState {
	Loaded = "loaded",
	Loading = "loading",
}

// temporary
type LoadingCallback = (height: number, width: number) => void

// TODO: Board really should be where the player's blocks are stored
export class Board {
	// Keeps a reference to all parts generated in the draw method and it used to automatically clean them up
	private level_janitor = new Janitor()

	// Used to cleanup events whene the board is destroyed
	private event_janitor = new Janitor()

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

	public tile_class_array: (Tile | 0)[][] = []

	public loading: RBXScriptSignal<LoadingCallback>
	public unloading: RBXScriptSignal<LoadingCallback>
	private events = {
		loading: new Instance("BindableEvent") as BindableEvent<LoadingCallback>,
		unloading: new Instance("BindableEvent") as BindableEvent<LoadingCallback>,
	}

	constructor(private position: Vector3, private level_data: LevelData) {
		// init level variables
		this.width = level_data.level_tiles[0].size()
		this.height = level_data.level_tiles.size()

		// init events
		this.loading = this.events.loading.Event
		this.unloading = this.events.unloading.Event

		let combined_tile_array: [string, typeof Tile | CustomTile][] = [...this.default_tiles]
		if (level_data.tiles) {
			combined_tile_array = [...this.default_tiles, ...level_data.tiles]
		}
		this.tiles = new Map<string, typeof Tile | CustomTile>(combined_tile_array)
	}

	public getTile(x: number, y: number): Tile | 0 {
		// x or y is out of range of the board
		if (!inRange(x, 0, this.width - 1) || !inRange(y, 0, this.height - 1)) {
			return 0
		}

		return this.tile_class_array[y][x]
	}

	// TODO: make this a promise or non-async
	public draw() {
		this.events.loading.Fire(this.height, this.width)

		// clear the board if it's already been drawn
		this.level_janitor.Cleanup()

		// generate Tile objects from level_tiles data
		// TODO: convert this to promise
		this.level_data.level_tiles.forEach((tile_string) => {
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

					if ("teleporter" in tile) {
						return new TeleporterTile(this, tile.teleporter!.targets)
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
		this.unloadBoard()
		this.draw()
	}

	public unloadBoard() {
		if (this.tile_count.Value <= 0) {
			return
		}

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
		e.Event.Wait()

		// tile animations have finished, destroy instances
		this.level_janitor.Cleanup()
	}

	public destroy() {
		this.unloadBoard()
		this.event_janitor.Cleanup()
	}
}

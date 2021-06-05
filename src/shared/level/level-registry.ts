export {}
// import { Janitor } from "@rbxts/janitor"
// import Maid from "@rbxts/maid"
// import Make from "@rbxts/make"
// import { Workspace } from "@rbxts/services"
// import { generator } from "shared/utility/generators"
// // import { Button } from "./level"

// class Button {}

// interface ValidatedLevelData {
// 	level_data: LevelData
// 	start_tile_position: Vector3
// 	end_tile_position: Vector3
// }

// interface ValidateResult {
// 	success: boolean
// 	invalid_symbols: Set<unknown>
// 	data: ValidatedLevelData
// }

// const default_symbols = [" ", "1", "2", "3"] as const
// class Level {
// 	public tile_symbol_set = new Set<string>(default_symbols)
// 	private tile_symbol_map = new Map<string, Button>()
// 	private level_data: LevelData = []

// 	public addTile(symbol: string, tile: Button): void {
// 		this.tile_symbol_set.add(symbol)
// 		this.tile_symbol_map.set(symbol, tile)
// 	}

// 	public setData(level_data: LevelData) {
// 		this.level_data = level_data
// 	}

// 	public getData() {
// 		return this.level_data
// 	}

// 	public validate(): ValidateResult {
// 		const invalid_symbols = new Set()
// 		let success = true

// 		let start_tile_count = 0
// 		let start_tile_position = new Vector3()

// 		let end_tile_count = 0
// 		let end_tile_position = new Vector3()

// 		for (const [r, c, v] of generator.array2d(this.level_data)) {
// 			if (!this.tile_symbol_set.has(v)) {
// 				invalid_symbols.add(v)
// 				success = false
// 				continue
// 			}

// 			if (v === "2") {
// 				start_tile_count += 1
// 				start_tile_position = new Vector3(c, 0, r)
// 			} else if (v === "3") {
// 				end_tile_count += 1
// 				end_tile_position = new Vector3(c, 0, r)
// 			}
// 		}

// 		if (start_tile_count !== 1) {
// 			warn(`invalid start tile configuration`)
// 			success = false
// 		}

// 		if (end_tile_count !== 1) {
// 			warn(`invalid end tile configuration`)
// 			success = false
// 		}

// 		return {
// 			success: success,
// 			invalid_symbols: invalid_symbols,
// 			data: {
// 				level_data: this.level_data,
// 				start_tile_position: start_tile_position,
// 				end_tile_position: end_tile_position,
// 			},
// 		}
// 	}
// }

// /**
//  * The Level Registry keeps track of all level layouts.
//  * Levels need to be loaded into the registry before they can be displayed in the game.
//  */
// export class LevelRegistry {
// 	public levels: ValidatedLevelData[] = []
// 	public new_level = new Level()

// 	/**
// 	 * Checks if the level is valid and adds it to the level register.
// 	 * @param name An identifier used for debugging
// 	 */
// 	public addLevel(name: string): void {
// 		const validation_info = this.new_level.validate()
// 		if (validation_info.success) {
// 			this.levels.push(validation_info.data)
// 		} else {
// 			const arr = []
// 			for (const str of validation_info.invalid_symbols) {
// 				arr.push(tostring(str))
// 			}
// 			warn(`${name} is not a valid level. Invalid characters: ${arr.join(",")}`)
// 		}
// 		this.new_level = new Level()
// 	}

// 	public setupLevels() {
// 		level_setup.forEach((addLevel) => {
// 			addLevel()
// 		})
// 	}

// 	/**
// 	 * Loads a level from the registry. Can be generated in the world by calling the
// 	 * .load() method.
// 	 */
// 	public loadLevel(index: number) {
// 		const level = this.levels[index]
// 		return { ...level, level_builder: new LevelBuilder(level) }
// 	}
// }

// /**
//  * This class is used as a wrapper for displaying levels in the workspace.
//  * Created when retrieving a level from the level registry, designed to
//  * prevent displaying levels that haven't been verified.
//  */
// class LevelBuilder {
// 	private janitor = new Janitor<{ level: Folder }>()
// 	constructor(private level: ValidatedLevelData) {}

// 	public load(position_offset = new Vector3()) {
// 		const level_folder = Make("Folder", {
// 			Name: "level",
// 		})

// 		// if the level has already been loaded, unload it and load again
// 		this.janitor.Add(level_folder, "Destroy", "level")

// 		const data = this.level.level_data
// 		const size = new Vector3(1, 0.2, 1)

// 		for (const [row, column, value] of generator.array2d(data)) {
// 			if (value === " ") continue

// 			let colour: Color3 | undefined
// 			if (value === "2") {
// 				print("start", row, column, position_offset)
// 				print(new Vector3(column, 0 - size.Y / 2, row).add(position_offset))
// 				colour = new Color3(0, 1, 0)
// 			} else if (value === "3") {
// 				colour = new Color3(1, 0, 0)
// 			} else colour = new Color3(1, 1, 1)

// 			const p = Make("Part", {
// 				Position: new Vector3(column, 0 - size.Y / 2, row).add(position_offset),
// 				Size: size,
// 				Name: value === "2" ? "Start" : "Part",
// 				Color: colour,
// 				Anchored: true,
// 				Parent: level_folder,
// 				Children: [
// 					Make("Decal", {
// 						Texture: "rbxasset://assets/bloxorz/images/tile.png",
// 						Face: Enum.NormalId.Top,
// 						Color3: colour,
// 					}),
// 					Make("Texture", {
// 						Texture: "rbxassetid://6666199681",
// 						StudsPerTileU: 1,
// 						OffsetStudsV: 1,
// 						Face: Enum.NormalId.Back,
// 					}),
// 					Make("Texture", {
// 						Texture: "rbxassetid://6666199681",
// 						StudsPerTileU: 1,
// 						OffsetStudsV: 1,
// 						Face: Enum.NormalId.Left,
// 					}),
// 				],
// 			})

// 			level_folder.Parent = Workspace
// 		}
// 		return data
// 	}

// 	public unload() {
// 		this.janitor.Cleanup()
// 	}
// }

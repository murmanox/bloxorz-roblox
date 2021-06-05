export {}
// import { RotatingPlayer } from "client/player/game/Player"

// type Position = { row: number; column: number }

// export class Tile {
// 	public up?: Tile
// 	public down?: Tile
// 	public left?: Tile
// 	public right?: Tile

// 	public position: Position

// 	constructor(kind: TileType, row: number, column: number) {
// 		this.position = { row: row, column: column }
// 	}

// 	public setUp(tile: Tile) {
// 		this.up = tile
// 		tile.down = this
// 	}

// 	public setDown(tile: Tile) {
// 		this.down = tile
// 		tile.up = this
// 	}

// 	public setLeft(tile: Tile) {
// 		this.left = tile
// 		tile.right = this
// 	}

// 	public setRight(tile: Tile) {
// 		this.right = tile
// 		tile.left = this
// 	}
// }

// type ButtonCallback = (player: RotatingPlayer) => boolean
// export class Button {
// 	public targets: Position[] = []
// 	public pressed_callback?: ButtonCallback

// 	constructor(targets: Position[], callback?: ButtonCallback) {
// 		this.pressed_callback = callback
// 		this.targets = targets
// 	}

// 	/**
// 	 * Called when the player steps on the tile.
// 	 */
// 	public pressed(player: RotatingPlayer) {
// 		const triggered = this.pressed_callback ? this.pressed_callback(player) : true
// 		if (!triggered) return

// 		this.targets.forEach((pos) => {
// 			// get tile in position
// 			// activate tile
// 		})
// 	}
// }

// class Level {
// 	public tiles: Tile[][] = []
// 	public start_tile?: Tile
// 	public end_tile?: Tile

// 	constructor(level_data: LevelData) {
// 		for (const [row, row_data] of ipairs(level_data)) {
// 			const row_array: Tile[] = []

// 			for (const [column, kind] of ipairs(row_data)) {
// 				const tile = new Tile(kind, row, column)
// 				row_array.push(tile)

// 				// initialise tile's up property
// 				if (row >= 0) {
// 					const up_tile = this.tiles[row - 1][column]
// 					tile.setUp(up_tile)
// 				}

// 				// initialise tile's left property
// 				if (column >= 0) {
// 					const left_tile = this.tiles[row][column - 1]
// 					tile.setLeft(left_tile)
// 				}

// 				if (kind === TileType.Start) {
// 					this.start_tile = tile
// 				} else if (kind === TileType.End) {
// 					this.end_tile = tile
// 				}
// 			}

// 			this.tiles.push(row_array)
// 		}

// 		if (!this.start_tile) {
// 			error("start tile is undefined for level")
// 		}

// 		if (!this.end_tile) {
// 			error("end tile is undefined for level")
// 		}
// 	}

// 	public setStartTile(tile: Tile) {
// 		this.start_tile = tile
// 	}

// 	public setEndTile(tile: Tile) {
// 		this.end_tile = tile
// 	}

// 	public show() {}
// }

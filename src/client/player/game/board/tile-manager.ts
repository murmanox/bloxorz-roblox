import { Workspace } from "@rbxts/services"
import { verticalInAnimation, verticalOutAnimation } from "client/player/game/effects/tile-animations"
import { LevelConfig } from "shared/config/levels/level-types"
import { inRange } from "shared/utility/math"
import { TileMap } from "types/interfaces/level-types"
import { ITile, TileProperties } from "types/interfaces/tile-types"
import { empty_tile, Tile } from "../tiles/tile"
import { Board } from "./board"

const wooden: TileProperties = { kind: "tile", fragile: true }
const tile: TileProperties = { kind: "tile" }
const end_tile: TileProperties = { kind: "end" }

const DEFAULT_TILES_MAP = new Map<string, TileProperties>([
	["w", wooden],
	["1", tile],
	["2", end_tile],
])

export class TileManager {
	public tiles: ITile[] = []
	private tiles_map: Map<string, TileProperties> = new Map([...DEFAULT_TILES_MAP])
	private container: Instance = Workspace

	constructor(public board: Board, tile_container?: Instance) {
		this.container = tile_container ?? this.container
	}

	public setLevelTiles(tiles?: TileMap) {
		this.tiles_map = tiles ? new Map([...DEFAULT_TILES_MAP, ...tiles]) : DEFAULT_TILES_MAP
	}

	public getTile(x: number, y: number): ITile {
		const size = this.board.getSize()

		// x or y is out of range of the board
		if (!inRange(x, 0, size.X - 1) || !inRange(y, 0, size.Y - 1)) {
			return empty_tile
		}

		const index = size.X * y + x
		return this.tiles[index]
	}

	/**
	 * Generate tile instances from the level data and add them to the tile container
	 */
	public generate(level_data: LevelConfig) {
		const tiles: Array<ITile> = []

		for (const str of level_data.level_tiles) {
			for (const char of str) {
				const tile = this.tiles_map.get(char)

				// check if tile is valid
				if (tile === undefined) {
					tiles.push(empty_tile)
					continue
				}

				tiles.push(new Tile(this.board, tile))
			}
		}
		this.tiles = tiles
	}

	// Add all tiles to workspace and animate them into position
	public load(size: Vector2): Promise<any> {
		return Promise.all(
			this.tiles.map((tile, i) => {
				// Add the tile to workspace so it's visible
				if (tile.instance) {
					tile.instance.Parent = Workspace
				}

				// Animate tile into position
				return verticalInAnimation(tile, new Vector3(i % size.X, 0, math.floor(i / size.X)))
			})
		)
	}

	// Animate tiles and then remove them from the workspace
	public unload() {
		return Promise.all(
			this.tiles.map((tile) => {
				// Animate tile out
				return verticalOutAnimation(tile).then(() => {
					if (tile.instance) tile.instance.Destroy()
				})
			})
		).then(() => {
			this.tiles = []
		})
	}
}

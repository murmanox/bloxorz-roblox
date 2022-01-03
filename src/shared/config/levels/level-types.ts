import { TileProperties } from "types/interfaces/tile-types"

type StartPosition = { row: number; column: number; length: number; direction: Vector3 }

export interface LevelConfig {
	name: string
	description?: string
	image: string
	start_positions: StartPosition[]
	level_tiles: string[]
	tiles?: Map<string, TileProperties>
}

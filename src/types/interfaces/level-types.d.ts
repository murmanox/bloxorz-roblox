import { TileProperties } from "./tile-types"

export interface StartPosition {
	row: number
	column: number
	length: number
	direction: Vector3
}
interface Position {
	row: number
	column: number
}

export type TileMap = Map<string, TileProperties>

export interface LevelData {
	name: string
	description: string
	image: string

	start_positions: StartPosition[]
	star_locations?: [Position, Position, Position][]
	level_tiles: string[] // possibly rename this
	tiles?: TileMap
}

import { ToggleTile, VerticalButtonTile, WoodenTile } from "."
import ButtonTile from "./button-tile"
import EndTile from "./end-tile"
import Tile from "./tile"

export type TileClasses =
	| typeof Tile
	| typeof ButtonTile
	| typeof EndTile
	| typeof ToggleTile
	| typeof VerticalButtonTile
	| typeof WoodenTile

export type TileInstances = Tile | ButtonTile | EndTile | ToggleTile | VerticalButtonTile | WoodenTile

export type TileModel = Model & {
	PrimaryPart: BasePart
}

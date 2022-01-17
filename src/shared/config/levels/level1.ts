import { v3 } from "shared/utility/vector3-utils"
import { TileProperties } from "types/interfaces/tile-types"
import { LevelConfig } from "./level-types"

export default {
	name: "LEVEL 1",
	description:
		"The aim of the game is to get the block to fall into the square hole to progress to the next level.\n" +
		"Use E S D F to move", // custom controls
	image: "rbxasset://assets/bloxorz/images/level_previews/level1.png",

	start_positions: [
		{ row: 1, column: 1, length: 2, direction: v3.up },
		// { row: 1, column: 0, length: 1, direction: v3.up },
		// { row: 0, column: 1, length: 1, direction: v3.up },
		// { row: 1, column: 2, length: 1, direction: v3.up },
	],

	// prettier-ignore
	level_tiles: [
		"111       ",
		"111b9     ",
		"11111 111 ",
		" 1111t1111",
		"      1211",
		"      111 ",
	],
	// level_tiles: [
	// 	"111       ",
	// 	"111111    ",
	// 	"111111111 ",
	// 	" 111111111",
	// 	"     11211",
	// 	"      111 ",
	// ],

	tiles: new Map<string, TileProperties>([
		["b", { kind: "button", activate: [{ column: 5, row: 3 }] }],
		["t", { kind: "tile", toggle: { initial: true } }],
		[
			"9",
			{
				kind: "button",
				teleport: [
					{ row: 4, column: 6 },
					{ row: 1, column: 3 },
				],
				heavy: true,
			},
		],
	]),
} as LevelConfig

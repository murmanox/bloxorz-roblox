import { v3 } from "shared/utility/vector3-utils"
import { TileProperties } from "types/interfaces/tile-types"
import { LevelConfig } from "./level-types"

export default {
	name: "LEVEL 2",
	description:
		"Switches are activated when you step on them." +
		"X-shaped switches are heavy and require you to stand upright to activate them.",
	image: "rbxasset://assets/bloxorz/images/level_previews/level2.png",

	start_positions: [{ row: 4, column: 1, length: 2, direction: v3.up }],
	level_tiles: [
		"      1111  111",
		"1111  11X1  121",
		"11O1  1111  111",
		"1111  1111  111",
		"1111tt1111tt111",
		"1111  1111     ",
	],

	tiles: new Map<string, TileProperties>([
		[
			"O",
			{
				kind: "button",
				activate: [
					{ column: 4, row: 4 },
					{ column: 5, row: 4 },
				],
			},
		],
		[
			"X",
			{
				kind: "button",
				activate: [
					{ column: 10, row: 4 },
					{ column: 11, row: 4 },
				],
				heavy: true,
			},
		],
		[
			"t",
			{
				kind: "tile",
				toggle: {
					initial: false,
				},
			},
		],
	]),
} as LevelConfig

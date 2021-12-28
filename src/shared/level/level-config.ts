import { ButtonAction } from "shared/game/tiles/ButtonAction"
import { v3 } from "shared/utility/vector3-utils"

// greyscale colour 84, 92, 255
// 524383

interface Position {
	row: number
	column: number
}

interface Button {
	targets: Position[]
	action?: ButtonAction
}

interface Toggle {
	initial: boolean
}

interface Teleporter {
	targets: Position[]
}

interface CustomTiles {
	button: Button
	vertical_button: Button
	toggle: Toggle
	teleporter: Teleporter
}

export type CustomTile = PickOne<CustomTiles>

export interface StartPosition {
	row: number
	column: number
	length: number
	direction: Vector3
}

export interface LevelData {
	name: string
	description: string
	image: string

	start_positions: StartPosition[]
	star_locations?: [Position, Position, Position][]
	level_tiles: string[] // possibly rename this
	tiles?: Map<string, CustomTile>
}

const level1 = {
	name: "LEVEL 1",
	description:
		"The aim of the game is to get the block to fall into the square hole to progress to the next level. \n" +
		"Use E S D F to move",
	image: "rbxasset://assets/bloxorz/images/level_previews/level1.png",

	start_positions: [{ row: 1, column: 1, length: 2, direction: v3.up }],
	// eslint-disable-next-line prettier/prettier
	level_tiles: [
		"111       ",
		"111111    ",
		"111111111 ",
		" 111111111",
		"     11211",
		"      111 ",
	],
}

const level2 = {
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

	tiles: new Map<string, CustomTile>([
		[
			"O",
			{
				button: {
					targets: [
						{ column: 4, row: 4 },
						{ column: 5, row: 4 },
					],
				},
			},
		],
		[
			"X",
			{
				vertical_button: {
					targets: [
						{ column: 10, row: 4 },
						{ column: 11, row: 4 },
					],
				},
			},
		],
		[
			"t",
			{
				toggle: {
					initial: false,
				},
			},
		],
	]),
}

const level3 = {
	name: "LEVEL 3",
	description: "Be careful not to fall off the edges. The level will be restarted if this happens.",
	image: "rbxasset://assets/bloxorz/images/level_previews/level3.png",

	start_positions: [{ row: 3, column: 1, length: 2, direction: v3.up }],
	level_tiles: [
		"      1111111  ",
		"1111  111  11  ",
		"111111111  1111",
		"1111       1121",
		"1111        111",
	],
}

const level4 = {
	name: "LEVEL 4",
	description: "Orange tiles are fragile. Make sure not to stand upright on them.",
	image: "rbxasset://assets/bloxorz/images/level_previews/level4.png",

	start_positions: [{ row: 5, column: 1, length: 2, direction: v3.up }],
	star_locations: [{ row: 8, column: 13 }],
	level_tiles: [
		"   wwwwwww    ",
		"   wwwwwww    ",
		"1111     111  ",
		"111       11  ",
		"111       11  ",
		"111  1111ww1ww",
		"111  1111wwwww",
		"     121  ww1w",
		"     111  wwww",
	],
}

const level5 = {
	name: "LEVEL 5",
	description:
		"Not all switches behave the same. Some will toggle bridges, while some may only deactivate them.",
	image: "rbxasset://assets/bloxorz/images/level_previews/level5.png",

	start_positions: [{ row: 1, column: 13, length: 2, direction: v3.up }],
	level_tiles: [
		"           1111",
		" 1111bb1o111111",
		" 1111       111",
		" 11p1          ",
		" 1111          ",
		"   111u1bb111  ",
		"          1111i",
		"111       11111",
		"12111bb111111  ",
		"1111           ",
	],
	tiles: new Map<string, CustomTile>([
		["b", { toggle: { initial: true } }],
		[
			"o",
			{
				button: {
					targets: [
						{ column: 5, row: 1 },
						{ column: 6, row: 1 },
					],
				},
			},
		],
		[
			"p",
			{
				button: {
					targets: [
						{ column: 5, row: 8 },
						{ column: 6, row: 8 },
					],
					action: ButtonAction.Activate,
				},
			},
		],
		[
			"u",
			{
				button: {
					targets: [
						{ column: 5, row: 8 },
						{ column: 6, row: 8 },
					],
					action: ButtonAction.Deactivate,
				},
			},
		],
		[
			"i",
			{
				button: {
					targets: [
						{ column: 5, row: 8 },
						{ column: 6, row: 8 },
					],
				},
			},
		],
	]),
}

const level6 = {
	name: "LEVEL 6",
	description: "",
	image: "",

	start_positions: [{ row: 3, column: 0, length: 2, direction: v3.up }],
	level_tiles: [
		"     111111    ",
		"     1  111    ",
		"     1  11111  ",
		"111111     1111",
		"    111    1121",
		"    111     111",
		"      1  11    ",
		"      11111    ",
		"      11111    ",
		"       111     ",
	],
}

const level7 = {
	name: "LEVEL 7",
	description: "",
	image: "",

	start_positions: [{ row: 3, column: 1, length: 2, direction: v3.up }],
	level_tiles: [
		"        1111   ",
		"        1111   ",
		"111     1  1111",
		"111111111   121",
		"111    11x  111",
		"111    111  111",
		" 11b   1       ",
		"  111111       ",
	],
	tiles: new Map<string, CustomTile>([
		["b", { toggle: { initial: false } }],
		["x", { vertical_button: { targets: [{ column: 3, row: 6 }] } }],
	]),
}

const level8 = {
	name: "LEVEL 8",
	description: "",
	image: "",

	start_positions: [{ row: 4, column: 1, length: 2, direction: v3.up }],
	level_tiles: [
		"         111   ",
		"         111   ",
		"         111   ",
		"111111   111111",
		"1111t1   111121",
		"111111   111111",
		"         111   ",
		"         111   ",
		"         111   ",
	],
	tiles: new Map<string, CustomTile>([
		[
			"t",
			{
				teleporter: {
					targets: [
						{ column: 10, row: 1 },
						{ column: 10, row: 7 },
					],
				},
			},
		],
	]),
}

const level9 = {
	name: "LEVEL 9",
	description: "",
	image: "",

	start_positions: [{ row: 1, column: 1, length: 2, direction: v3.up }],
	level_tiles: [
		"1111   1   1111",
		"1111   1   11t1",
		"111111111111111",
		"      121      ",
		"      111      ",
	],
	tiles: new Map<string, CustomTile>([
		[
			"t",
			{
				teleporter: {
					targets: [
						{ column: 12, row: 1 },
						{ column: 2, row: 1 },
					],
				},
			},
		],
	]),
}

const level10 = {
	name: "LEVEL 10",
	description: "",
	image: "",

	start_positions: [{ row: 1, column: 9, length: 2, direction: v3.up }],
	level_tiles: [
		"111     111111",
		"121vv1vv1111t1",
		"111     1111v ",
		"         111v ",
		"           11 ",
		"            1 ",
		"            1 ",
		"           11 ",
		"    11111  11 ",
		"    1o  111x1 ",
	],
	tiles: new Map<string, CustomTile>([
		[
			"t",
			{
				teleporter: {
					targets: [
						{ column: 12, row: 1 },
						{ column: 9, row: 1 },
					],
				},
			},
		],
		["v", { toggle: { initial: false } }],
		[
			"o",
			{
				button: {
					targets: [
						{ column: 3, row: 1 },
						{ column: 4, row: 1 },
					],
				},
			},
		],
		[
			"x",
			{
				vertical_button: {
					targets: [
						{ column: 6, row: 1 },
						{ column: 7, row: 1 },
						{ column: 12, row: 2 },
						{ column: 12, row: 3 },
					],
				},
			},
		],
	]),
}

// // TODO: Clean this up
// export const levels: LevelData[] = [
// 	level1,
// 	level2,
// 	level3,
// 	level4,
// 	level5,
// 	level6,
// 	level7,
// 	level8,
// 	level9,
// 	level10,
// ]

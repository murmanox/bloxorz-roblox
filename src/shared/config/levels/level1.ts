import { v3 } from "shared/utility/vector3-utils"

export default {
	name: "LEVEL 1",
	description:
		"The aim of the game is to get the block to fall into the square hole to progress to the next level.\n" +
		"Use E S D F to move", // custom controls
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

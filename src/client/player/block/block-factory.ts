import { StartPosition } from "shared/level/level-config"
import { v3 } from "shared/utility/vector3-utils"
import { DEFAULT_BLOCK_LENGTH, Block } from "./block"

export abstract class BlockFactory {
	static createBlock(position: Vector3, direction = v3.up, length = DEFAULT_BLOCK_LENGTH) {
		const positions = []
		for (let i = 0; i < length; i++) {
			positions.push(position.add(direction.mul(i)))
		}

		return new Block(positions)
	}

	static fromStartPosition(position: StartPosition): Block {
		return BlockFactory.createBlock(
			new Vector3(position.column, 0, position.row),
			position.direction,
			position.length
		)
	}

	static fromStartPositions(positions: StartPosition[]): Block[] {
		const blocks = []
		for (const position of positions) {
			blocks.push(BlockFactory.fromStartPosition(position))
		}
		return blocks
	}
}

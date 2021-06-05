import { Janitor } from "@rbxts/janitor"
import { ContextActionService, RunService, UserInputService } from "@rbxts/services"
import { v3 } from "shared/utility/vector3-utils"
import { settings } from "../settings/keybinds"
import { Block } from "./block"
import { DisplayArrow } from "./display-arrow"
import type { Game, GameState } from "./Game"

const left_vector = v3.left
const right_vector = v3.right
const forward_vector = v3.back
const back_vector = v3.forward

enum BindActionNames {
	Space = "space",
}

const BLOCK_SIZE = 1
const arrow_offset = 0.15

type PlayerControllableBlock = Block

const arrow_position_callback = (block: PlayerControllableBlock): Vector3 => {
	if (block.isStanding()) {
		return block.getPosition().add(new Vector3(0, BLOCK_SIZE * block.length - BLOCK_SIZE / 2, 0))
	} else {
		return block.getPosition().add(new Vector3(0, BLOCK_SIZE / 2, 0))
	}
}

const action_direction_map = {
	up: forward_vector,
	down: back_vector,
	left: left_vector,
	right: right_vector,
}

type MoveBeganCallback = (block: Block) => void

export class PlayerController {
	public blocks: PlayerControllableBlock[]
	public current_block: PlayerControllableBlock
	public arrow: DisplayArrow
	private janitor = new Janitor()

	public onMoveCallback?: (block: PlayerControllableBlock, direction: Vector3) => void

	public move_began: RBXScriptSignal<MoveBeganCallback>
	public move_ended: RBXScriptSignal<MoveBeganCallback>
	private events = {
		move_began: new Instance("BindableEvent") as BindableEvent<MoveBeganCallback>,
		move_ended: new Instance("BindableEvent") as BindableEvent<MoveBeganCallback>,
	}

	constructor(private app: Game, blocks: PlayerControllableBlock[]) {
		this.blocks = blocks
		this.current_block = blocks[0]

		this.arrow = new DisplayArrow(() => {
			return arrow_position_callback(this.current_block)
		}, new Vector3(0, arrow_offset, 0))
		this.janitor.Add(this.arrow, "destroy")

		if (this.blocks.size() > 1) {
			this.arrow.show()
		} else {
			this.arrow.hide()
		}

		// init events
		this.move_began = this.events.move_began.Event
		this.janitor.Add(this.events.move_began)
		this.move_ended = this.events.move_ended.Event
		this.janitor.Add(this.events.move_ended)

		this.handleInput()
	}

	private onMove(action_name: keyof typeof action_direction_map) {
		// is it bad to use a callback here instead of having a debounce on player controller? probably
		this.events.move_began.Fire(this.current_block)

		const direction = action_direction_map[action_name as keyof typeof action_direction_map]
		this.current_block.move(direction)

		// check if block is next to another block, combine if so
		this.checkCombine(this.current_block)
		if (this.onMoveCallback) this.onMoveCallback(this.current_block, direction)
	}

	public nextBlock() {
		const blocks_length = this.blocks.size()
		if (blocks_length <= 1) return

		const block_index = this.blocks.findIndex((block) => block === this.current_block)
		const index = (block_index + 1) % blocks_length
		this.current_block = this.blocks[index]
	}

	// this can definitely be optimised
	public checkCombine(block: PlayerControllableBlock) {
		// this would probably be cool if I could check up, down, left and right on the board
		const current_block = this.current_block

		// standing blocks can't be combined
		if (current_block.isStanding()) return

		for (const other_block of this.blocks) {
			// don't compare a block against itself
			if (other_block === current_block) continue
			if (other_block.isStanding()) continue

			const positions = [...block.positions, ...other_block.positions]

			// TODO: prevent overlapping
			// if blocks overlap, don't combine
			const overlap = other_block.positions.some((other_position) => {
				return current_block.positions.findIndex((v) => v === other_position) !== -1
			})

			if (overlap) {
				continue
			}

			for (const position of current_block.positions) {
				for (const other_position of other_block.getPositions()) {
					// check if block is next to another block
					if (position.sub(other_position).Magnitude !== 1) continue

					// check that other block is along same axis
					const all_x_equal = positions.map((v) => v.X).every((x, _, arr) => x === arr[0])
					const all_z_equal = positions.map((v) => v.Z).every((z, _, arr) => z === arr[0])

					// position doesn't follow direction of current block
					if (!all_x_equal && !all_z_equal) {
						print("can't combine")
						continue
					}

					// combine blocks
					const new_block = current_block.combine(other_block)

					// remove current and other block from the blocks array and replace with the combined block
					this.blocks.remove(this.blocks.findIndex((find_block) => find_block === current_block))
					this.blocks.remove(this.blocks.findIndex((find_block) => find_block === other_block))

					current_block.destroy()
					other_block.destroy()

					this.blocks.push(new_block)
					this.current_block = new_block

					// new block may be able to combine into another block
					this.checkCombine(new_block)
					return
				}
			}
		}

		if (this.blocks.size() > 1) {
			this.arrow.show()
		} else {
			this.arrow.hide()
		}
	}

	public checkCombineAll() {}

	public handleInput() {
		ContextActionService.BindAction(
			BindActionNames.Space,
			(name, state, input) => {
				if (state === Enum.UserInputState.Begin) {
					this.nextBlock()
				}
			},
			false,
			Enum.KeyCode.Space
		)

		const onUpdate = (dt: number) => {
			if (this.app.state !== "Waiting") {
				return
			}

			// check all bound keys until we find one
			for (const [action_name, value] of pairs(settings.keybinds)) {
				for (const keycode of value) {
					if (UserInputService.IsKeyDown(keycode)) {
						this.onMove(action_name)
						return
					}
				}
			}
		}

		this.janitor.Add(RunService.RenderStepped.Connect(onUpdate))
	}

	// TODO: use the same controller for everything and overwrite the blocks?
	// deletes the player controller and all properties and methods
	public destroy() {
		this.janitor.Cleanup()
		ContextActionService.UnbindAction(BindActionNames.Space)
		this.blocks.forEach((block) => {
			block.destroy()
		})
	}
}

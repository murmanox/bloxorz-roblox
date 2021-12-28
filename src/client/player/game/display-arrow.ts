import { Janitor } from "@rbxts/janitor"
import { ReplicatedStorage, RunService, Workspace } from "@rbxts/services"
import { v3 } from "shared/utility/vector3-utils"

const model = ReplicatedStorage.assets.mesh.arrow
const ARROW_SIZE_OFFSET = new Vector3(0, model.Size.Y / 2, 0)

enum ArrowState {
	Visible = "visible",
	Hidden = "hidden",
}

const ROTATION_SPEED = -math.pi / 2
export class DisplayArrow {
	private rotation = 0
	private instance: MeshPart
	private janitor = new Janitor<{ update: RBXScriptConnection }>()
	private state: ArrowState = ArrowState.Hidden

	private offset: Vector3 = v3.zero
	private target?: PVInstance

	constructor() {
		this.instance = this.janitor.Add(model.Clone())
	}

	public setTarget(target: PVInstance) {
		this.target = target
		return this
	}

	public setOffset(offset: Vector3 = v3.zero) {
		this.offset = offset.add(ARROW_SIZE_OFFSET)
		return this
	}

	// Connects the arrow's update method to RunService.Heartbeat
	public show() {
		if (this.state !== ArrowState.Visible) {
			this.state = ArrowState.Visible

			this.janitor.Add(
				RunService.Heartbeat.Connect((dt) => {
					this.update(dt)
				}),
				"Disconnect",
				"update"
			)
		}
		return this
	}

	// Removes the arrow from Workspace and disconnects the update method.
	public hide() {
		if (this.state !== ArrowState.Hidden) {
			this.state = ArrowState.Hidden

			this.rotation = 0
			this.instance.Parent = undefined
			this.janitor.Remove("update")
		}

		return this
	}

	/**
	 * Updates the arrow's position to match the target
	 * Rotates the arrow and makes it bounce
	 */
	public update(dt: number) {
		if (!this.target) return

		// Make sure the arrow is visible
		if (!this.instance.Parent) this.instance.Parent = Workspace

		this.rotation += ROTATION_SPEED * dt
		const animation_offset = new Vector3(0, math.abs(math.sin(this.rotation * 1.25) / 4), 0)
		const target_position = this.target.GetPivot().Position.add(this.offset)

		// position arrow
		this.instance.CFrame = new CFrame(target_position)
			.mul(CFrame.Angles(0, this.rotation, 0))
			.add(animation_offset)
	}

	/**
	 * Disconnect up all events and destroy all Instances
	 */
	public destroy() {
		this.janitor.Cleanup()
	}
}

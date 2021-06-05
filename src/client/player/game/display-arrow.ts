import { Janitor } from "@rbxts/janitor"
import { ReplicatedStorage, RunService, Workspace } from "@rbxts/services"
import { v3 } from "shared/utility/vector3-utils"

interface LowercasePosition {
	position: Vector3
}
interface UppercasePosition {
	Position: Vector3
}

type Vector3Callback = (...args: any) => Vector3
type HasPosition = LowercasePosition | UppercasePosition | Vector3Callback

const model = ReplicatedStorage.assets.mesh.arrow

enum ArrowState {
	Visible = "visible",
	Hidden = "hidden",
}

const ROTATION_SPEED = -math.pi / 2
export class DisplayArrow {
	private rotation = 0
	private offset: Vector3
	private instance: MeshPart
	private janitor = new Janitor<{ update: RBXScriptConnection }>()
	private state: ArrowState = ArrowState.Hidden

	constructor(public target: HasPosition, offset = v3.zero) {
		this.offset = offset.add(new Vector3(0, model.Size.Y / 2, 0))
		this.instance = this.janitor.Add(model.Clone())
	}

	public setTarget(target: HasPosition, offset?: Vector3) {
		this.target = target

		if (offset) {
			this.offset = offset
		}
	}

	public show() {
		if (this.state !== ArrowState.Visible) {
			this.state = ArrowState.Visible

			// update once to stop arrow teleporting when shown
			this.update(0)
			this.instance.Parent = Workspace

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

	public hide() {
		if (this.state !== ArrowState.Hidden) {
			this.state = ArrowState.Hidden

			this.rotation = 0
			this.instance.Parent = undefined
			this.janitor.Remove("update")
		}

		return this
	}

	public update(dt: number) {
		this.rotation += ROTATION_SPEED * dt
		const vertical_offset = math.abs(math.sin(this.rotation * 1.25) / 4)

		let target_position: Vector3
		if (typeIs(this.target, "function")) {
			target_position = this.target()
		} else {
			target_position = "position" in this.target ? this.target.position : this.target.Position
		}
		target_position = target_position.add(this.offset)

		// rotate arrow
		this.instance.CFrame = new CFrame(target_position)
			.mul(CFrame.Angles(0, this.rotation, 0))
			.add(new Vector3(0, vertical_offset, 0))
	}

	public destroy() {
		this.janitor.Cleanup()
	}
}

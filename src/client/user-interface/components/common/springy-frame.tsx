import Roact from "@rbxts/roact"
import Flipper from "@rbxts/flipper"
import { RoactBinding } from "client/user-interface/roact-binding"
import { UDimMath } from "shared/utility/udim-math"

interface Props {
	GoalPosition: UDim2
	StartPosition: UDim2
	Size: UDim2 | Roact.Binding<UDim2>
	AnchorPoint?: Vector2 | Roact.Binding<Vector2>
	native?: Roact.JsxInstance<Frame>
	[Roact.Children]?: Roact.Children
}

interface State {
	visible: boolean
}

type UDim2Motor = {
	x_scale: number
	x_offset: number
	y_scale: number
	y_offset: number
}

class SpringyFrame extends Roact.PureComponent<Props, State> {
	body_position: RoactBinding<UDim2>
	body_motor: Flipper.GroupMotor<UDim2Motor>
	spring_options = { frequency: 4.5, dampingRatio: 1 }
	goal_position: UDim2 | Roact.Binding<UDim2>

	constructor(props: Props) {
		super(props)

		this.body_position = new RoactBinding(this.props.StartPosition)
		this.goal_position = this.body_position.getValue()
		this.body_motor = new Flipper.GroupMotor({
			x_scale: this.body_position.getValue().X.Scale,
			x_offset: this.body_position.getValue().X.Offset,
			y_scale: this.body_position.getValue().Y.Scale,
			y_offset: this.body_position.getValue().Y.Offset,
		})

		this.body_motor.onStep((p) => {
			return this.body_position.setValue(
				new UDim2(p.x_scale, math.round(p.x_offset), p.y_scale, math.round(p.y_offset))
			)
		})
	}

	private setGoalPosition(): void {
		const position = UDimMath.getUDim2Value(this.props.GoalPosition)
		const motor = (value: number) => new Flipper.Spring(value, this.spring_options)

		this.body_motor.setGoal({
			x_scale: motor(position.X.Scale),
			x_offset: motor(position.X.Offset),
			y_scale: motor(position.Y.Scale),
			y_offset: motor(position.Y.Offset),
		})
	}

	public render(): Roact.Element | undefined {
		this.setGoalPosition()

		return (
			<frame
				Position={this.body_position.getBinding()}
				Size={this.props.Size}
				AnchorPoint={this.props.AnchorPoint}
				BackgroundColor3={new Color3(0, 1, 0)}
				BorderSizePixel={0}
			>
				{this.props[Roact.Children]}
			</frame>
		)
	}
}

export default SpringyFrame

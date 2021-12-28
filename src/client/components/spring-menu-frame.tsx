import Roact from "@rbxts/roact"
import Flipper from "@rbxts/flipper"
import MenuFrame from "../user-interface/components/common/menu-frame"
import { RoactBinding } from "client/user-interface/roact-binding"
import { Math } from "shared/utility/math"

interface SpringMenuFrameProps {
	Key?: string
	InPosition: UDim2
	OutPosition: UDim2
	Size: UDim2 | Roact.Binding<UDim2>
	Hide: boolean
	[Roact.Children]?: Roact.Children
}

interface SpringMenuFrameState {
	visible: boolean
}

class SpringMenuFrame extends Roact.Component<SpringMenuFrameProps, SpringMenuFrameState> {
	body_position: RoactBinding<UDim2>
	body_motor: Flipper.SingleMotor
	spring_options = { frequency: 3.5, dampingRatio: 1 }

	constructor(props: SpringMenuFrameProps) {
		super(props)

		this.body_position = new RoactBinding(this.props.OutPosition)
		this.body_motor = new Flipper.SingleMotor(0)

		this.body_motor.onStep((p) => {
			// Make sure body is visible when being moved on and off screen
			if (!this.state.visible && !this.props.Hide) {
				this.setState({
					visible: true,
				})
			}

			this.body_position.setValue(
				this.props.OutPosition.Lerp(this.props.InPosition, Math.roundTo(p, 3)) // round to prevent snapping when finished
			)
		})

		// Change visibility state when component has finished changing position
		this.body_motor.onComplete(() => {
			if (this.props.Hide && this.state.visible) {
				this.setState({
					visible: false,
				})
			} else if (!this.props.Hide && !this.state.visible) {
				this.setState({
					visible: true,
				})
			}
		})
	}

	public render(): Roact.Element | undefined {
		this.body_motor.setGoal(new Flipper.Spring(this.props.Hide ? 0 : 1, this.spring_options))

		// Stop rendering component when it's off the screen
		if (this.props.Hide && !this.state.visible) {
			return
		}

		return (
			<MenuFrame Position={this.body_position.getBinding()} Size={this.props.Size}>
				{this.props[Roact.Children]}
			</MenuFrame>
		)
	}
}

export default SpringMenuFrame

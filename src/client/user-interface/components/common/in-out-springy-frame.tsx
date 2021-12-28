import Roact from "@rbxts/roact"
import Flipper from "@rbxts/flipper"
import { RoactBinding } from "client/user-interface/roact-binding"
import { Math } from "shared/utility/math"

interface Props {
	In: UDim2
	Out: UDim2
	Visible: boolean
	native?: Roact.JsxInstance<Frame>
	[Roact.Children]?: Roact.Children
}
interface State {}

class InOutSpringyFrame extends Roact.PureComponent<Props, State> {
	private position: RoactBinding<UDim2>
	private motor: Flipper.SingleMotor

	constructor(props: Props) {
		super(props)
		this.motor = new Flipper.SingleMotor(0)
		this.position = new RoactBinding(this.lerp(this.motor.getValue()))

		this.motor.onStep((value) => {
			this.position.setValue(this.lerp(Math.roundTo(value, 3)))
		})
	}

	private lerp(alpha: number) {
		return this.props.Out.Lerp(this.props.In, alpha)
	}

	render(): Roact.Element | undefined {
		this.motor.setGoal(new Flipper.Spring(this.props.Visible ? 1 : 0))

		return (
			<frame {...this.props.native} Position={this.position.getBinding()}>
				{this.props[Roact.Children]}
			</frame>
		)
	}
}

export default InOutSpringyFrame

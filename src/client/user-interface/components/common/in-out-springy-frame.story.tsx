import Roact from "@rbxts/roact"
import InOutSpringyFrame from "./in-out-springy-frame"

interface Props {}
interface State {
	visible: boolean
}

class Test extends Roact.Component<Props, State> {
	private running = true

	public didMount() {
		spawn(() => {
			while (this.running) {
				this.setState({ visible: !this.state.visible })
				wait(1)
			}
		})
	}

	public willUnmount() {
		this.running = false
	}

	render(): Roact.Element | undefined {
		return (
			<InOutSpringyFrame
				In={new UDim2(0, 0, 0, 0)}
				Out={new UDim2(0, 0, 0, -70)}
				Visible={this.state.visible || false}
				native={{
					Size: new UDim2(1, 0, 0, 70),
				}}
			></InOutSpringyFrame>
		)
	}
}

export = (story: GuiObject) => {
	const handle = Roact.mount(<Test />, story)

	return () => {
		Roact.unmount(handle)
	}
}

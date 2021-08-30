import Roact from "@rbxts/roact"
import { RoactBinding } from "client/user-interface/roact-binding"

interface Props {
	LayoutOrder?: Roact.JsxInstance<Frame>["LayoutOrder"]
	[Roact.Children]?: Roact.Children
}
interface State {}

class ScalingFrame extends Roact.Component<Props, State> {
	height_px = new RoactBinding(0)
	frame_ref = Roact.createRef<Frame>()
	list_ref = Roact.createRef<UIListLayout>()

	public render(): Roact.Element | undefined {
		return (
			<frame
				LayoutOrder={this.props.LayoutOrder}
				Ref={this.frame_ref}
				Transparency={1}
				Size={this.height_px.map((v) => new UDim2(1, 0, 0, v))}
				ClipsDescendants={true}
				Change={{
					AbsoluteSize: (rbx) => {
						const gui_children = rbx
							.GetChildren()
							.filter((child) => child.IsA("GuiObject")) as GuiObject[]
						const padding = this.list_ref.getValue()?.Padding.Offset || 0

						this.height_px.setValue(
							gui_children.reduce<number>((total, child) => total + child.AbsoluteSize.Y, 0) +
								math.max(0, gui_children.size() - 1) * padding
						)
					},
				}}
			>
				<uilistlayout Ref={this.list_ref} Padding={new UDim(0, 4)} />
				{this.props[Roact.Children]}
			</frame>
		)
	}
}

export default ScalingFrame

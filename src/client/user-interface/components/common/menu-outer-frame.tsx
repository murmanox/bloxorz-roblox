import Roact from "@rbxts/roact"

interface Props {
	Size: UDim2 | Roact.Binding<UDim2>
	Position?: UDim2 | Roact.Binding<UDim2>
	[Roact.Children]?: Roact.Children
	native?: Roact.JsxInstance<Frame>
}

const MenuOuterFrame = (props: Props): Roact.Element => (
	<frame
		{...props.native}
		Size={props.Size}
		Position={props.Position}
		BorderSizePixel={0}
		Transparency={0.75}
		BackgroundColor3={new Color3(0, 0, 0)}
	>
		<uistroke Thickness={2} Transparency={0.5} />
		{props[Roact.Children]}
	</frame>
)

export default MenuOuterFrame

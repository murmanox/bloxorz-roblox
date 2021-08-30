import Roact from "@rbxts/roact"
import MenuOuterFrame from "./menu-outer-frame"

const inner_padding = new UDim(0, 10)

interface MenuFrameProps {
	Size: UDim2 | Roact.Binding<UDim2>
	Position: UDim2 | Roact.Binding<UDim2>
	[Roact.Children]?: Roact.Children
}

const MenuFrame = (props: MenuFrameProps): Roact.Element => {
	return (
		<MenuOuterFrame Size={props.Size} Position={props.Position}>
			<uipadding PaddingLeft={inner_padding} PaddingRight={inner_padding} />
			<frame
				Size={UDim2.fromScale(1, 1)}
				BackgroundColor3={new Color3(1, 1, 1)}
				Transparency={0.97}
			>
				{props[Roact.Children]}
			</frame>
		</MenuOuterFrame>
	)
}

export default MenuFrame

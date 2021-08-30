import Roact from "@rbxts/roact"

interface Props {
	Position: UDim2
	[Roact.Children]?: Roact.Children
}

const MenuBodyScrollingFrame = (props: Props) => {
	return (
		<scrollingframe
			Size={new UDim2(1, 0, 1, 0).sub(props.Position)}
			Position={props.Position}
			BackgroundTransparency={1}
			BorderSizePixel={0}
			ClipsDescendants={true}
			ScrollBarImageTransparency={0.25}
			ScrollBarThickness={8}
			ScrollBarImageColor3={new Color3()}
			CanvasSize={UDim2.fromScale(0, 0)}
			AutomaticCanvasSize="Y"
			VerticalScrollBarInset={"Always"}
			VerticalScrollBarPosition="Right"
		>
			<uipadding
				PaddingRight={new UDim(0, 20)}
				PaddingLeft={new UDim(0, 20)}
				PaddingBottom={new UDim(0, 20)}
				PaddingTop={new UDim(0, 20)}
			/>
			{props[Roact.Children]}
		</scrollingframe>
	)
}

export default MenuBodyScrollingFrame

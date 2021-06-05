import Roact from "@rbxts/roact"

export = (parent: GuiBase2d) => {
	const slider = (
		<frame
			AnchorPoint={new Vector2(0.5, 0.5)}
			BackgroundTransparency={1}
			Position={new UDim2(0.5, 0, 0.5, 0)}
			Size={new UDim2(0.9, 0, 0, 5)}
		>
			<textbutton
				AnchorPoint={new Vector2(0.5, 0.5)}
				LayoutOrder={1}
				Position={new UDim2(0.25, 0, 0.5, 0)}
				Size={new UDim2(0, 20, 0, 20)}
				BackgroundColor3={new Color3(1,1,1)}
				Text={""}
				ZIndex={2}
			>
				<uicorner
					CornerRadius={new UDim(1,0)}
				/>
			</textbutton>
			<frame
				AnchorPoint={new Vector2(1, 0)}
				BackgroundColor3={Color3.fromRGB(110, 110, 110)}
				BorderSizePixel={0}
				Position={new UDim2(1, 0, 0, 0)}
				Size={new UDim2(0.75, 0, 1, 0)}
			/>
			<frame
				BackgroundColor3={Color3.fromRGB(232, 232, 232)}
				BorderSizePixel={0}
				Size={new UDim2(0.25, 0, 1, 0)}
			/>
		</frame>
	)

	const h = Roact.mount(slider, parent)

	return () => {
		Roact.unmount(h)
	}
}

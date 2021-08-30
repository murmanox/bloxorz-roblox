import Roact from "@rbxts/roact"
import soundManager from "client/modules/sound-manager"

const LockedOverlay = () => {
	return (
		<frame
			Size={UDim2.fromScale(1, 1)}
			Transparency={0.5}
			BackgroundColor3={new Color3()}
			ZIndex={2}
		>
			<uicorner CornerRadius={new UDim(0.1, 0)} />
			<imagelabel
				BackgroundTransparency={1}
				Image="rbxassetid://192776775"
				ImageTransparency={0.25}
				Size={UDim2.fromScale(1, 1)}
			>
				<uicorner CornerRadius={new UDim(0.1, 0)} />
			</imagelabel>
			<imagelabel
				BackgroundTransparency={1}
				ImageTransparency={0.25}
				Position={UDim2.fromScale(0.5, 0.6)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Image="rbxasset://assets/bloxorz/images/circle_gradient.png"
				Size={UDim2.fromScale(0.6, 0.6)}
			/>
			<imagelabel
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0.6)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Image="rbxasset://assets/bloxorz/images/lock_dark.png"
				Size={UDim2.fromScale(0.4, 0.4)}
			>
				<uicorner CornerRadius={new UDim(0.1, 0)} />
			</imagelabel>
		</frame>
	)
}

interface StarProps {
	Index: number
	Amount: number
	Rotation?: number
	Position: "left" | "middle" | "right"
	Size: UDim2
	Colour: Color3
	ZIndex?: number
}

const Star = (props: StarProps) => {
	let position: UDim2
	let anchor: Vector2
	let image: string
	if (props.Position === "left") {
		position = UDim2.fromScale(0, 0.5)
		anchor = new Vector2(0, 0.5)
		if (props.Amount >= props.Index) {
			image = "rbxasset://assets/bloxorz/images/star_left_b&w.png"
		} else {
			image = "rbxasset://assets/bloxorz/images/star_left_background.png"
		}
	} else if (props.Position === "middle") {
		position = UDim2.fromScale(0.5, 0.46)
		anchor = new Vector2(0.5, 0.5)
		if (props.Amount >= props.Index) {
			image = "rbxasset://assets/bloxorz/images/star_b&w.png"
		} else {
			image = "rbxasset://assets/bloxorz/images/star_background.png"
		}
	} else {
		position = UDim2.fromScale(1, 0.5)
		anchor = new Vector2(1, 0.5)
		if (props.Amount >= props.Index) {
			image = "rbxasset://assets/bloxorz/images/star_right_b&w.png"
		} else {
			image = "rbxasset://assets/bloxorz/images/star_right_background.png"
		}
	}

	if (props.Amount >= props.Index) {
		// collected star
		return (
			<frame
				Rotation={props.Rotation}
				Position={position}
				Size={props.Size}
				Transparency={1}
				AnchorPoint={anchor}
				ZIndex={(props.ZIndex || 1) + 3}
			>
				<imagelabel
					Transparency={1}
					Key="collected_star"
					ZIndex={props.Index}
					Size={UDim2.fromScale(1, 1)}
					Image={image}
					ImageColor3={props.Colour}
				>
					<uiaspectratioconstraint AspectRatio={1} />
				</imagelabel>
			</frame>
		)
	} else {
		// empty star
		return (
			<frame
				Rotation={props.Rotation}
				Position={position}
				Size={props.Size}
				Transparency={1}
				AnchorPoint={anchor}
				ZIndex={props.ZIndex}
			>
				<imagelabel
					Transparency={1}
					Key="collected_star"
					ZIndex={2}
					Size={UDim2.fromScale(1, 1)}
					Image={image}
					ImageColor3={Color3.fromRGB(53, 53, 53)}
				>
					<uiaspectratioconstraint AspectRatio={1} />
					<imagelabel
						Transparency={1}
						Key="collected_star"
						ZIndex={2}
						AnchorPoint={new Vector2(0.5, 0.5)}
						Position={UDim2.fromScale(0.5, 0.5)}
						Size={UDim2.fromScale(0.9, 0.9)}
						Image={image}
						ImageColor3={Color3.fromRGB(91, 91, 91)}
					/>
				</imagelabel>
			</frame>
		)
	}
}

const UnlockedOverlay = (props: { Locked: boolean; Stars: number }) => {
	return (
		<frame
			Key="unlocked_overlay"
			Transparency={1}
			Size={UDim2.fromScale(1, 1)}
			BackgroundColor3={new Color3(0, 0, 0)}
			ZIndex={2}
			Event={{
				MouseEnter: (rbx) => {
					rbx.Transparency = 0.85
				},
				MouseLeave: (rbx) => {
					rbx.Transparency = 1
				},
			}}
		>
			<imagelabel
				BackgroundTransparency={1}
				Image="rbxassetid://192776775"
				ImageTransparency={0.65}
				Size={UDim2.fromScale(1, 1)}
			>
				<uicorner CornerRadius={new UDim(0.1, 0)} />
			</imagelabel>
			<frame
				Key="star_overlay"
				Transparency={1}
				Size={UDim2.fromScale(0.6, 0.333)}
				Position={UDim2.fromScale(0.5, 1)}
				AnchorPoint={new Vector2(0.5, 1)}
			>
				<Star
					Key="left_star"
					Index={1}
					Amount={props.Stars}
					Position={"left"}
					Size={UDim2.fromScale(0.662, 1.193)}
					Colour={Color3.fromRGB(255, 245, 0)}
				/>
				<Star
					Key="right_star"
					Index={2}
					Amount={props.Stars}
					Position={"right"}
					Size={UDim2.fromScale(0.662, 1.193)}
					Colour={Color3.fromRGB(255, 245, 0)}
				/>
				<Star
					Key="middle_star"
					Index={3}
					Amount={props.Stars}
					Position={"middle"}
					Size={UDim2.fromScale(0.728, 1.312)}
					Colour={Color3.fromRGB(255, 217, 0)}
					ZIndex={2}
				/>
				{/* <imagelabel
					Key="gradient"
					Image="rbxasset://assets/bloxorz/images/white_circle_gradient.png"
					ImageColor3={new Color3(255, 255, 150)}
					ImageTransparency={0.4}
					ZIndex={0}
					AnchorPoint={new Vector2(0.5, 0.5)}
					Size={UDim2.fromScale(1.25, 1)}
					Position={UDim2.fromScale(0.5, 0.5)}
					BackgroundTransparency={1}
				/> */}
			</frame>
		</frame>
	)
}

const LevelButtonOverlay = (props: { Locked: boolean; Stars: number }) => {
	if (props.Locked) {
		return <LockedOverlay />
	}
	return <UnlockedOverlay Locked={props.Locked} Stars={props.Stars} />
}

const locked_stroke_colour = Color3.fromRGB(125, 125, 125)
const unlocked_stroke_colour = new Color3(1, 1, 1)

interface LevelButtonProps {
	LevelData: {
		name: string
		unlocked: boolean
		image: string
		score: number
	}
	LayoutOrder?: number
}

const LevelButton = (props: LevelButtonProps) => {
	return (
		<frame Size={UDim2.fromScale(1, 1)} LayoutOrder={props.LayoutOrder} BorderSizePixel={0}>
			<uicorner CornerRadius={new UDim(0.1, 0)} />

			{/* colour of stroke depends on locked state */}
			<uistroke
				Color={props.LevelData.unlocked ? unlocked_stroke_colour : locked_stroke_colour}
				LineJoinMode="Round"
				Thickness={2}
				Transparency={0}
				ApplyStrokeMode="Contextual"
			/>

			<imagelabel
				Key="level_image"
				Size={UDim2.fromScale(1, 1)}
				BackgroundTransparency={1}
				BorderSizePixel={0}
				Image={props.LevelData.image}
				ImageRectOffset={new Vector2(props.LevelData.unlocked ? 0 : 300)}
				ImageRectSize={new Vector2(300, 300)}
			>
				<uicorner CornerRadius={new UDim(0.1, 0)} />
			</imagelabel>

			{/* Display locked or unlocked overlay */}
			<LevelButtonOverlay Locked={!props.LevelData.unlocked} Stars={props.LevelData.score} />
			<frame Size={UDim2.fromScale(1, 1)} ZIndex={2} Transparency={1}>
				<textbutton
					Text=""
					Size={UDim2.fromScale(1, 1)}
					BackgroundTransparency={1}
					BorderSizePixel={0}
					Event={{
						MouseEnter: (rbx) => {
							soundManager.play("interface_mouse_over")
						},
						Activated: () => {
							if (props.LevelData.unlocked) {
								print(`Load level: ${props.LevelData.name}`)
								return
							}
							print(`Level locked: ${props.LevelData.name}`)
						},
					}}
				/>
			</frame>

			<textlabel
				Key="level_name"
				ZIndex={10}
				Text={props.LevelData.name}
				TextColor3={new Color3(1, 1, 1)}
				Size={UDim2.fromScale(1, 0.333)}
				Font="Code"
				TextScaled={true}
				BackgroundTransparency={1}
				BorderSizePixel={0}
			/>
		</frame>
	)
}

export default LevelButton

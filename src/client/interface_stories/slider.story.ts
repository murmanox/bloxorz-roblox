import { Janitor } from "@rbxts/janitor"
import Make from "@rbxts/make"
import { UserInputService, Workspace } from "@rbxts/services"

function map(n: number, oldMin: number, oldMax: number, min: number, max: number) {
	return min + (max - min) * ((n - oldMin) / (oldMax - oldMin))
}

function makeSlider(parent: GuiBase2d, size: UDim2, position: UDim2) {
	// this is pain
	return Make("Frame", {
		Size: size,
		Position: position,
		BackgroundTransparency: 1,
		BorderColor3: new Color3(1, 0, 0),
		BackgroundColor3: new Color3(255, 255, 255),
		Parent: parent,
		AnchorPoint: new Vector2(0.5, 0.5),
		Children: [
			Make("UIStroke", {}),
			Make("Frame", {
				Name: "slider",
				AnchorPoint: new Vector2(0.5, 0.5),
				BackgroundTransparency: 1,
				Position: UDim2.fromScale(0.5, 0.5),
				Size: new UDim2(0.95, 0, 0, 5),
				Children: [
					Make("Frame", {
						Name: "left_half",
						Size: new UDim2(0.25, 0, 1, 0),
						BackgroundColor3: Color3.fromRGB(232, 232, 232),
						BorderSizePixel: 0,
						Children: [
							Make("UICorner", {
								CornerRadius: new UDim(1, 0),
							}),
						],
					}),
					Make("Frame", {
						Name: "right_half",
						AnchorPoint: new Vector2(1, 0),
						Position: new UDim2(1, 0, 0, 0),
						Size: new UDim2(0.75, 0, 1, 0),
						BackgroundColor3: Color3.fromRGB(110, 110, 110),
						BorderSizePixel: 0,
						Children: [
							Make("UICorner", {
								CornerRadius: new UDim(1, 0),
							}),
						],
					}),
					Make("TextButton", {
						Name: "button",
						AnchorPoint: new Vector2(0.5, 0.5),
						Position: UDim2.fromScale(0.25, 0.5),
						Size: UDim2.fromOffset(10, 30),

						BackgroundColor3: Color3.fromRGB(255, 255, 255),
						BorderSizePixel: 0,
						ZIndex: 2,

						Text: "",
						Children: [
							Make("UICorner", {
								CornerRadius: new UDim(1, 0),
							}),
						],
					}),
				],
			}),
		],
	}) as GuiSlider
}

function makeTooltip(parent: GuiBase2d) {
	return Make("TextLabel", {
		Size: new UDim2(0, 250, 0, 30),
		Position: new UDim2(0, 0, 0, 0),
		AnchorPoint: new Vector2(0.5, 1),
		Visible: false,
		Parent: parent,
		Text: "0",
		TextSize: 20,
		Font: Enum.Font.Code,
		ZIndex: 2,
	})
}

const hover_input_map = new Map<Enum.UserInputType, true>([
	[Enum.UserInputType.MouseMovement, true],
	[Enum.UserInputType.Touch, true],
])

interface SliderJanitorInstances {
	input_changed: RBXScriptConnection
	input_ended: RBXScriptConnection
	button_input_ended: RBXScriptConnection
	button_input_began: RBXScriptConnection
	box_input_began: RBXScriptConnection
}

type SliderChangedCallback = (slider: Slider, value: number) => void
type SliderHoveredCallback = (slider: Slider, position: Vector3) => void
type SliderHoverEndedCallback = (slider: Slider) => void
type SliderClickedCallback = (slider: Slider, position: Vector3) => void

class Slider {
	private static INCREMENT_SNAPPING_MULTIPLIER = 0.3

	// public size: UDim2
	public min_value: number
	public max_value: number
	public increment: number
	public value!: number

	private janitor = new Janitor<SliderJanitorInstances>()

	public instance: GuiSlider

	public changed: RBXScriptSignal<SliderChangedCallback>
	public clicked: RBXScriptSignal<SliderClickedCallback>
	public hovering: RBXScriptSignal<SliderHoveredCallback>
	public hover_ended: RBXScriptSignal<SliderHoverEndedCallback>
	private events = {
		changed: new Instance("BindableEvent") as BindableEvent<SliderChangedCallback>,
		clicked: new Instance("BindableEvent") as BindableEvent<SliderClickedCallback>,
		hovering: new Instance("BindableEvent") as BindableEvent<SliderHoveredCallback>,
		hover_ended: new Instance("BindableEvent") as BindableEvent<SliderHoverEndedCallback>,
	}

	constructor(
		size: UDim2,
		position: UDim2,
		parent: GuiBase2d,
		{
			initial,
			min = 0,
			max = 100,
			increment = 1,
		}: { initial: number; min: number; max: number; increment: number }
	) {
		// this.size = size
		this.min_value = min
		this.max_value = max
		this.increment = increment

		this.instance = this.janitor.Add(makeSlider(parent, size, position))
		this.setValue(initial)

		// init events
		this.janitor.Add(this.events.changed)
		this.changed = this.events.changed.Event

		this.janitor.Add(this.events.clicked)
		this.clicked = this.events.clicked.Event

		this.janitor.Add(this.events.hovering)
		this.hovering = this.events.hovering.Event

		this.janitor.Add(this.events.hover_ended)
		this.hover_ended = this.events.hover_ended.Event

		// init input handlers
		this.initInputHandlers()
	}

	public incrementValue() {
		this.setValue(this.value + this.increment)
	}

	public decrementValue() {
		this.setValue(this.value - this.increment)
	}

	public setValue(value: number) {
		const curr = this.value || value
		value = math.clamp(value, this.min_value, this.max_value)

		// change rounding method based on the direction the slider is being moved.
		const round = value < curr ? math.ceil : value > curr ? math.floor : math.round
		const snapping_increment = this.increment * Slider.INCREMENT_SNAPPING_MULTIPLIER
		const offset = value < curr ? -snapping_increment : value > curr ? snapping_increment : 0

		value = round((value + offset) / this.increment) * this.increment

		if (value === this.value) return

		// update instance
		const x = map(value, this.min_value, this.max_value, 0, 1)

		this.instance.slider.button.Position = UDim2.fromScale(x, 0.5)
		this.instance.slider.left_half.Size = new UDim2(x, 0, 0, 5)
		this.instance.slider.right_half.Size = new UDim2(1 - x, 0, 0, 5)

		this.value = value
		this.events.changed.Fire(this, value)
	}

	private initInputHandlers() {
		const onHitboxInputBegan = (input: InputObject) => {
			if (hover_input_map.get(input.UserInputType)) {
				this.events.hovering.Fire(this, input.Position)
			}
		}

		const onHitboxInputEnded = (input: InputObject) => {
			if (hover_input_map.get(input.UserInputType)) {
				this.events.hover_ended.Fire(this)
			}
		}

		// player has clicked on the slider
		const input_began = (input: InputObject) => {
			if (
				input.UserInputType === Enum.UserInputType.MouseButton1 ||
				input.UserInputType === Enum.UserInputType.Touch
			) {
				this.janitor.Add(
					UserInputService.InputChanged.Connect(handle_input),
					"Disconnect",
					"input_changed"
				)

				this.janitor.Add(
					UserInputService.InputEnded.Connect(disconnect_input),
					"Disconnect",
					"input_ended"
				)

				const left = this.instance.slider.AbsolutePosition.X
				const right = left + this.instance.slider.AbsoluteSize.X

				const x = math.round(math.clamp(input.Position.X - left, 0, right - left))
				const scaled_x = map(x, 0, right - left, this.min_value, this.max_value)
				this.setValue(scaled_x)
			}

			if (input.KeyCode === Enum.KeyCode.F) this.incrementValue()
			if (input.KeyCode === Enum.KeyCode.S) this.decrementValue()
		}

		// player has stopped dragging the slider
		const disconnect_input = (input: InputObject) => {
			if (
				input.UserInputType === Enum.UserInputType.MouseButton1 ||
				input.UserInputType === Enum.UserInputType.Touch
			) {
				this.janitor.Remove("input_changed")
				this.janitor.Remove("input_ended")
			}
		}

		const handle_input = (input: InputObject) => {
			if (input.UserInputType === Enum.UserInputType.MouseMovement) {
				// update value based on position
				const left = this.instance.slider.AbsolutePosition.X
				const right = left + this.instance.slider.AbsoluteSize.X

				const x = math.round(math.clamp(input.Position.X - left, 0, right - left))
				const scaled_x = map(x, 0, right - left, this.min_value, this.max_value)
				this.setValue(scaled_x)
			}
		}

		this.janitor.Add(this.instance.InputBegan.Connect(input_began), "Disconnect", "box_input_began")
		this.janitor.Add(this.instance.InputBegan.Connect(onHitboxInputBegan))
		this.janitor.Add(this.instance.InputChanged.Connect(onHitboxInputBegan))
		this.janitor.Add(this.instance.InputEnded.Connect(onHitboxInputEnded))

		this.janitor.Add(
			this.instance.slider.button.InputBegan.Connect(input_began),
			"Disconnect",
			"button_input_began"
		)

		this.janitor.Add(
			this.instance.slider.button.InputEnded.Connect(disconnect_input),
			"Disconnect",
			"button_input_ended"
		)
	}

	public destroy() {
		this.janitor.Destroy()
	}
}

// TODO: tooltip invisible when dragging without hovering

export = (parent: GuiBase2d) => {
	const camera = Workspace.CurrentCamera
	const janitor = new Janitor<{ input_changed: RBXScriptConnection }>()

	const tooltip_offset_x = 0
	const tooltip_offset_y = -7
	const tooltip = makeTooltip(parent)

	const slider = new Slider(new UDim2(1, 0, 0, 40), UDim2.fromScale(0.5, 0.5), parent, {
		initial: 11,
		min: 10,
		max: 13,
		increment: 0.1,
	})

	const slider2 = new Slider(new UDim2(1, 0, 0, 40), UDim2.fromScale(0.5, 0.75), parent, {
		initial: 11,
		min: 10,
		max: 13,
		increment: 0.1,
	})

	tooltip.Visible = true
	tooltip.Text = `${slider.value}`

	const update_tooltip = <T>(value: T, slider: Slider) => {
		tooltip.Text = `${value}`

		const button = slider.instance.slider.button
		const button_x_offset = button.AbsoluteSize.X * button.AnchorPoint.X

		let tooltip_left =
			button.AbsolutePosition.X + button_x_offset - tooltip.AbsoluteSize.X * tooltip.AnchorPoint.X

		tooltip_left += tooltip.AbsoluteSize.X * tooltip.AnchorPoint.X + tooltip_offset_x
		tooltip_left = math.clamp(
			tooltip_left,
			0 + tooltip.AbsoluteSize.X * tooltip.AnchorPoint.X + 5,
			camera!.ViewportSize.X - tooltip.AbsoluteSize.X * (1 - tooltip.AnchorPoint.X) - 5
		)

		const tooltip_offset = new Vector2(0, tooltip_offset_y)

		const slider_pos = button.AbsolutePosition.add(tooltip_offset).add(
			new Vector2(button_x_offset, 0)
		)
		tooltip.Position = UDim2.fromOffset(
			// tooltip_left + tooltip.AnchorPoint.X * tooltip.AbsoluteSize.X,
			tooltip_left,
			slider_pos.Y
		)
	}

	janitor.Add(slider, "destroy")
	janitor.Add(slider2, "destroy")
	janitor.Add(tooltip)

	slider.changed.Connect((slider, value) => {
		update_tooltip(value, slider)
	})

	slider.hovering.Connect((slider, position) => {
		tooltip.Visible = true
		update_tooltip(slider.value, slider)
	})

	slider.hover_ended.Connect((slider) => {
		tooltip.Visible = false
	})

	return () => {
		janitor.Destroy()
	}
}

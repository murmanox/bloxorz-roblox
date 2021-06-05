type GuiSlider = Frame & {
	slider: Frame & {
		right_half: Frame
		left_half: Frame
		button: TextButton & {
			UICorner: UICorner
		}
	}
}

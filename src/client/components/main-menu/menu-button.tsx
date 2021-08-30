import Roact from "@rbxts/roact"
import soundManager from "client/modules/sound-manager"

const button_background_colour = new Color3(0, 0, 0)

interface MenuButtonProps {
	Text: string
	onClick: () => void
	[Roact.Children]?: Roact.Children
}

const MenuButton = (props: MenuButtonProps) => {
	return (
		<textbutton
			Text={props.Text}
			TextScaled={true}
			TextColor3={new Color3(1, 1, 1)}
			TextXAlignment="Center"
			TextYAlignment="Center"
			Font="Code"
			BackgroundColor3={button_background_colour}
			BorderSizePixel={0}
			BackgroundTransparency={0.75}
			Size={UDim2.fromScale(1, 1)}
			Event={{
				Activated: () => props.onClick(),
				MouseEnter: (rbx) => {
					rbx.BackgroundTransparency = 0.65
					soundManager.play("interface_mouse_over")
				},
				MouseLeave: (rbx) => {
					rbx.BackgroundTransparency = 0.75
				},
			}}
		>
			<uiaspectratioconstraint AspectRatio={6.5} />
			{props[Roact.Children]}
		</textbutton>
	)
}

export default MenuButton

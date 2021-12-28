import Roact from "@rbxts/roact"
import MainMenuFrame from "client/user-interface/components/main-menu/components/main-menu-frame"

interface SettingsMenuProps {
	Hide: boolean
}

const SettingsMenu = (props: SettingsMenuProps): Roact.Element => {
	return (
		<MainMenuFrame
			Key="settings_menu"
			Size={UDim2.fromScale(1, 1)}
			Hide={props.Hide}
			HeaderText="SETTINGS"
		></MainMenuFrame>
	)
}

export default SettingsMenu

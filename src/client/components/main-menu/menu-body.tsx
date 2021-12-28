import Roact from "@rbxts/roact"
import { hooked } from "@rbxts/roact-hooked"
import { useSelector } from "@rbxts/roact-rodux-hooked"
import UpdatesMenu from "client/user-interface/components/main-menu/components/updates-menu"
import { AppState } from "client/user-interface/store"
import CreditsMenu from "../../user-interface/components/main-menu/components/credits-menu"
import SettingsMenu from "../../user-interface/components/main-menu/components/settings-menu"
import StatsMenu from "../../user-interface/components/main-menu/components/stats-menu"
import LevelSelect from "./level-select/level-select"

interface Props {
	Size: Roact.Binding<UDim2>
	Position: Roact.Binding<UDim2>
}

const MenuBody = hooked<Props>((props) => {
	const menu = useSelector((state: AppState) => state.menu.page)

	const is_level_select = menu === "level select"
	const is_stats = menu === "stats"
	const is_settings = menu === "settings"
	const is_updates = menu === "updates"
	const is_credits = menu === "credits"

	return (
		<frame Size={props.Size} Position={props.Position} Transparency={1}>
			<LevelSelect Hide={!is_level_select} />
			<StatsMenu Hide={!is_stats} />
			<UpdatesMenu Hide={!is_updates} />
			<SettingsMenu Hide={!is_settings} />
			<CreditsMenu Hide={!is_credits} />
		</frame>
	)
})

export default MenuBody

import Roact from "@rbxts/roact"
import UpdatesMenu from "client/user-interface/main-menu/components/updates-menu"
import CreditsMenu from "../../user-interface/main-menu/components/credits-menu"
import { UILevelData } from "./level-select/level-grid"
import LevelSelect from "./level-select/level-select"
import SettingsMenu from "../../user-interface/main-menu/components/settings-menu"
import StatsMenu from "../../user-interface/main-menu/components/stats-menu"
import { MainMenuStates } from "client/user-interface/main-menu/actions/types"

const x: UILevelData[] = []
for (let i = 1; i <= 100; i++) {
	x.push({
		name: tostring(i),
		unlocked: i < 10,
		score: math.random(0, 3),
		image: `rbxasset://assets/bloxorz/images/level_previews/level${((i - 1) % 5) + 1}.png`,
	})
}

interface MenuBodyProps {
	Menu: MainMenuStates
	Size: Roact.Binding<Vector2>
}

class MenuBody extends Roact.Component<MenuBodyProps, {}> {
	public render(): Roact.Element | undefined {
		const is_level_select = this.props.Menu === "level select"
		const is_stats = this.props.Menu === "stats"
		const is_settings = this.props.Menu === "settings"
		const is_updates = this.props.Menu === "updates"
		const is_credits = this.props.Menu === "credits"

		return (
			<frame
				Change={{
					AbsolutePosition: (rbx) => {
						const position = rbx.AbsolutePosition
						const parent_position = (rbx.Parent as GuiBase2d).AbsolutePosition // for use with hoarcekat
						rbx.Size = new UDim2(1, -position.X + parent_position.X + 10, 1, 0)
					},
				}}
				Transparency={1}
			>
				<LevelSelect Levels={x} Hide={!is_level_select} />
				<StatsMenu Hide={!is_stats} />
				<UpdatesMenu Hide={!is_updates} />
				<SettingsMenu Hide={!is_settings} />
				<CreditsMenu Hide={!is_credits} />
			</frame>
		)
	}
}

export default MenuBody

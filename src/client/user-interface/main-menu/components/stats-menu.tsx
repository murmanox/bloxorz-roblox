import Roact from "@rbxts/roact"
import { StoreProvider } from "@rbxts/roact-rodux"
import MainMenuFrame from "client/user-interface/main-menu/components/main-menu-frame"
import PlayerStore from "shared/rodux/store"
import StatsElements from "../../../components/main-menu/stats-menu/stats-list"

interface StatsMenuProps {
	Hide: boolean
}

const StatsMenu = (props: StatsMenuProps): Roact.Element => {
	return (
		<MainMenuFrame
			Key="stats_menu"
			Size={UDim2.fromScale(1, 1)}
			Hide={props.Hide}
			HeaderText="STATS"
		>
			<StoreProvider store={PlayerStore}>
				<StatsElements />
			</StoreProvider>
		</MainMenuFrame>
	)
}

export default StatsMenu

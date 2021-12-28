import Roact from "@rbxts/roact"
import { StoreProvider } from "@rbxts/roact-rodux"
import MainMenuFrame from "client/user-interface/components/main-menu/components/main-menu-frame"
import { store } from "client/user-interface/store"
import StatsElements from "../../../../components/main-menu/stats-menu/stats-list"

interface StatsMenuProps {
	Hide: boolean
}

const StatsMenu = (props: StatsMenuProps): Roact.Element => {
	return (
		<MainMenuFrame
			Key="stats_menu"
			Size={new UDim2(1, -10, 1, 0)}
			Hide={props.Hide}
			HeaderText="STATS"
		>
			<StoreProvider store={store}>
				<StatsElements />
			</StoreProvider>
		</MainMenuFrame>
	)
}

export default StatsMenu

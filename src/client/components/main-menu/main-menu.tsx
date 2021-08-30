import Roact from "@rbxts/roact"
import { connect } from "@rbxts/roact-rodux"
import Rodux from "@rbxts/rodux"
import { Game } from "client/player/game/game"
import { InterfaceActions, InterfaceState } from "client/rodux/menu-store/reducer"
import { setMenu as setGameMenu } from "client/user-interface/game-menu/actions/actions"
import { GameMenuStates } from "client/user-interface/game-menu/actions/types"
import { setMenu } from "client/user-interface/main-menu/actions/actions"
import { MainMenuStates } from "client/user-interface/main-menu/actions/types"
import { RoactBinding } from "client/user-interface/roact-binding"
import MainMenuList from "./main-menu-list"
import MenuBody from "./menu-body"

const mapStateToProps = (state: InterfaceState) => {
	return { menu: state.main_menu.menu, visible: state.game_menu.menu === "main" }
}

const mapDispatchToProps = (dispatch: Rodux.Dispatch<InterfaceActions>) => ({
	setMenu: (menu: GameMenuStates) => {
		dispatch(setGameMenu(menu))
	},
	setMainMenu: (menu: MainMenuStates) => {
		dispatch(setMenu(menu))
	},
})

interface Props {
	menu: MainMenuStates
	visible: boolean
	setMenu: (menu: GameMenuStates) => void
	setMainMenu: (menu: MainMenuStates) => void
}

interface State {}

const MainMenu = connect(
	mapStateToProps,
	mapDispatchToProps
)(
	class MainMenu extends Roact.PureComponent<Props, State> {
		public menu_size = new RoactBinding(new Vector2())

		public render(): Roact.Element | undefined {
			const element = (
				<frame Size={UDim2.fromScale(1, 1)} Transparency={1}>
					<uilistlayout
						FillDirection={Enum.FillDirection.Horizontal}
						SortOrder={Enum.SortOrder.LayoutOrder}
						Padding={new UDim(0, 20)}
					/>

					<MainMenuList
						visible={this.props.visible}
						Size={UDim2.fromScale(0.33, 1)}
						Position={UDim2.fromOffset(10, 0)}
						SizeChange={(size) => {
							this.menu_size.setValue(size)
						}}
						setMenu={this.props.setMainMenu}
						setGameMenu={this.props.setMenu}
					/>
					<MenuBody Menu={this.props.menu} Size={this.menu_size.getBinding()} />
				</frame>
			)
			return element
		}
	}
)

export default MainMenu

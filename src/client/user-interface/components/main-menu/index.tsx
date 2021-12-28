import Roact from "@rbxts/roact"
import { hooked, useBinding } from "@rbxts/roact-hooked"
import { useSelector } from "@rbxts/roact-rodux-hooked"
import { AppState } from "client/user-interface/store"
import MainMenuList from "../../../components/main-menu/main-menu-list"
import MenuBody from "../../../components/main-menu/menu-body"

const PADDING = new UDim(0, 15)

interface Props {}

const MainMenu = hooked<Props>((props) => {
	const [list_size, setListSize] = useBinding(new Vector2())
	const game_running = useSelector((state: AppState) => state.game.running)

	return (
		<>
			<MainMenuList
				visible={!game_running}
				Size={UDim2.fromScale(0.33, 1)}
				Position={UDim2.fromOffset(10, 0)}
				onSizeChange={setListSize}
			/>

			<MenuBody
				Size={list_size.map((size) => {
					return new UDim2(1, -size.X - PADDING.Offset, 1, 0)
				})}
				Position={list_size.map((size) => {
					return new UDim2(0, size.X + PADDING.Offset, 0, 0)
				})}
			/>
		</>
	)
})

export default MainMenu

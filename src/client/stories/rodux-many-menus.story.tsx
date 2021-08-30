import Roact from "@rbxts/roact"
import Rodux, { Store } from "@rbxts/rodux"
import RoactRodux, { StoreProvider } from "@rbxts/roact-rodux"

namespace State {
	export interface MainMenuState {
		page: "none" | "continue" | "level_select" | "stats"
	}

	export type MainMenuActions = ReturnType<typeof MainMenuActions[keyof typeof MainMenuActions]>
	export const MainMenuActions = {
		SetPage: Rodux.makeActionCreator("SetMainPage", (page: MainMenuState["page"]) => ({
			page,
		})),
	}

	export interface InGameMenuState {
		page: "none" | "continue" | "stats" | "settings"
	}

	export const InGameMenuActions = {
		SetPage: Rodux.makeActionCreator("SetGamePage", (page: InGameMenuState["page"]) => ({
			page,
		})),
	}
	export type InGameMenuActions = ReturnType<
		typeof InGameMenuActions[keyof typeof InGameMenuActions]
	>

	export interface MenuState {
		current: "game" | "main"
	}
	export const MenuActions = {
		SetMenu: Rodux.makeActionCreator("SetMenu", (current: MenuState["current"]) => ({
			current,
		})),
	}
	export type MenuActions = ReturnType<typeof MenuActions[keyof typeof MenuActions]>

	export const Store = new Rodux.Store(
		Rodux.combineReducers({
			menu: Rodux.createReducer<MenuState, MenuActions>(
				{
					current: "game",
				},
				{
					SetMenu: (state, action) => {
						return { ...state, current: action.current }
					},
				}
			),
			main: Rodux.createReducer<MainMenuState, MainMenuActions>(
				{
					page: "none",
				},
				{
					SetMainPage: (state, action) => {
						return { ...state, page: action.page }
					},
				}
			),

			game: Rodux.createReducer<InGameMenuState, InGameMenuActions>(
				{
					page: "none",
				},
				{
					SetGamePage: (state, action) => {
						return { ...state, page: action.page }
					},
				}
			),
		}),
		undefined,
		[Rodux.loggerMiddleware]
	)
}

namespace GameMenu {
	interface Props extends MappedProps, MappedDispatch {}

	interface MappedProps {}
	interface MappedDispatch {
		setMenu: (page: State.InGameMenuState["page"]) => void
	}

	const game_menu_component: Roact.FunctionComponent<Props> = (props: Props): Roact.Element => {
		return (
			<frame Transparency={1} Size={UDim2.fromScale(1, 1)}>
				<uilistlayout />
				<frame Transparency={1} Size={UDim2.fromScale(1, 0.3)}>
					<textlabel
						Text="Main"
						TextScaled={true}
						Size={UDim2.fromScale(1, 1)}
						BackgroundTransparency={1}
						TextColor3={new Color3(1, 1, 1)}
					/>
				</frame>
				<frame Transparency={1} Size={UDim2.fromScale(1, 0.7)}>
					<uilistlayout HorizontalAlignment={"Center"} />
					<textbutton
						Size={UDim2.fromOffset(100, 50)}
						Text={"Settings"}
						Event={{
							Activated: (rbx) => {
								props.setMenu("settings")
							},
						}}
					/>
					<textbutton
						Size={UDim2.fromOffset(100, 50)}
						Text={"Stats"}
						Event={{
							Activated: (rbx) => {
								props.setMenu("stats")
							},
						}}
					/>
					<textbutton
						Size={UDim2.fromOffset(100, 50)}
						Text={"Continue"}
						Event={{
							Activated: (rbx) => {
								props.setMenu("continue")
							},
						}}
					/>
				</frame>
			</frame>
		)
	}

	const mapDispatchToProps = (
		dispatch: Rodux.Dispatch<State.InGameMenuActions>
	): MappedDispatch => ({
		setMenu: (page) => {
			dispatch(State.InGameMenuActions.SetPage(page))
		},
	})

	export const GameMenu = RoactRodux.connect(undefined, mapDispatchToProps)(game_menu_component)
}

namespace MainMenu {
	interface Props extends MappedProps, MappedDispatch {}

	interface MappedProps {}
	interface MappedDispatch {
		setMenu: (page: State.MainMenuState["page"]) => void
	}

	const main_menu_component: Roact.FunctionComponent<Props> = (props: Props): Roact.Element => {
		print("render main")
		return (
			<frame Transparency={1} Size={UDim2.fromScale(1, 1)}>
				<uilistlayout />
				<frame Transparency={1} Size={UDim2.fromScale(1, 0.3)}>
					<textlabel
						Text="Game"
						TextScaled={true}
						Size={UDim2.fromScale(1, 1)}
						BackgroundTransparency={1}
						TextColor3={new Color3(1, 1, 1)}
					/>
				</frame>
				<frame Transparency={1} Size={UDim2.fromScale(1, 0.7)}>
					<uilistlayout HorizontalAlignment={"Center"} />
					<textbutton
						Size={UDim2.fromOffset(100, 50)}
						Text={"Level Select"}
						Event={{
							Activated: (rbx) => {
								props.setMenu("level_select")
							},
						}}
					/>
					<textbutton
						Size={UDim2.fromOffset(100, 50)}
						Text={"Stats"}
						Event={{
							Activated: (rbx) => {
								props.setMenu("stats")
							},
						}}
					/>
					<textbutton
						Size={UDim2.fromOffset(100, 50)}
						Text={"Continue"}
						Event={{
							Activated: (rbx) => {
								props.setMenu("continue")
							},
						}}
					/>
				</frame>
			</frame>
		)
	}
	const mapDispatchToProps = (dispatch: Rodux.Dispatch<State.MainMenuActions>): MappedDispatch => ({
		setMenu: (page) => {
			dispatch(State.MainMenuActions.SetPage(page))
		},
	})

	export const MainMenu = RoactRodux.connect(undefined, mapDispatchToProps)(main_menu_component)
}

const mapProps = (state: { menu: State.MenuState }) => {
	return { current: state.menu.current }
}

const Test = RoactRodux.connect(mapProps)((props: { current: State.MenuState["current"] }) => {
	return (
		<>
			<textbutton
				Size={UDim2.fromOffset(100, 50)}
				Text="Toggle"
				Position={UDim2.fromScale(0, 1)}
				AnchorPoint={new Vector2(0, 1)}
				Event={{
					Activated: (rbx) => {
						State.Store.dispatch(
							State.MenuActions.SetMenu(props.current !== "main" ? "main" : "game")
						)
					},
				}}
			/>
			{[
				props.current === "game" ? <GameMenu.GameMenu /> : <></>,
				props.current === "main" ? <MainMenu.MainMenu /> : <></>,
			]}
		</>
	)
})

export = (story: GuiObject) => {
	const element = (
		<StoreProvider store={State.Store}>
			<Test />
		</StoreProvider>
	)
	const handle = Roact.mount(element, story)
	return () => {
		Roact.unmount(handle)
	}
}

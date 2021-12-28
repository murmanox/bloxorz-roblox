import Roact, { Children } from "@rbxts/roact"
import { MenuStates, SET_MENU } from "client/user-interface/store/menu/types"
import SpringMenuFrame from "../spring-menu-frame"
import MenuButton from "../../user-interface/components/main-menu/components/menu-button"
import { store } from "client/user-interface/store"
import { START_GAME } from "client/user-interface/store/game/types"
import { hooked, useBinding, useEffect, useRef } from "@rbxts/roact-hooked"
import Spacer from "../../user-interface/components/common/spacer"
import { Workspace } from "@rbxts/services"
import Maid from "@rbxts/maid"

const HEADER_SIZE = new UDim2(0.95, 0, 0, 75)
const ENTER_UDIM2 = new UDim2(0, 10, 0, 0)
const EXIT_UDIM2 = new UDim2(-1, -2, 0, 0)

// I have too many frames
const LogoFrame = hooked<{ visible: boolean }>((props) => {
	return (
		<SpringMenuFrame
			InPosition={ENTER_UDIM2}
			OutPosition={EXIT_UDIM2}
			Size={new UDim2(1, -10, 1, 0)}
			Hide={!props.visible}
		>
			<frame
				Key="main_menu"
				LayoutOrder={-1}
				Size={UDim2.fromScale(1, 1)}
				BackgroundColor3={new Color3()}
				Transparency={1}
			>
				<textlabel
					Key="Header"
					Text="BLOXORZ"
					Size={HEADER_SIZE}
					AnchorPoint={new Vector2(0.5, 0)}
					Position={UDim2.fromScale(0.5, 0)}
					BackgroundTransparency={1}
					Font="Code"
					TextColor3={new Color3(1, 1, 1)}
					TextScaled={true}
					ZIndex={10}
				/>
				<frame
					Key="main_menu_inner_padding"
					Size={UDim2.fromScale(1, 1)}
					BackgroundColor3={new Color3(1, 1, 1)}
					Transparency={1}
				>
					<uipadding PaddingLeft={new UDim(0, 5)} PaddingRight={new UDim(0, 5)} />
					<uilistlayout
						Padding={new UDim(0.02, 0)}
						HorizontalAlignment={Enum.HorizontalAlignment.Center}
						VerticalAlignment={Enum.VerticalAlignment.Center}
					/>
					{props[Children]}
				</frame>
			</frame>
		</SpringMenuFrame>
	)
})

interface Props {
	Position: UDim2
	Size: UDim2
	visible: boolean
	onSizeChange?: (size: Vector2) => void
}

const MainMenuList = hooked<Props>((props) => {
	const ref = useRef<Frame>()
	const [max_size, setMaxSize] = useBinding(new Vector2())

	useEffect(() => {
		const maid = new Maid()

		// update the menu's size when the game is resized
		const parent = ref.getValue()?.Parent
		if (parent && parent.IsA("Frame")) {
			// running in hoarcekat
			maid.GiveTask(
				parent.GetPropertyChangedSignal("AbsoluteSize").Connect(() => {
					// window has been resized
					const parent = ref.getValue()?.Parent
					if (parent && parent.IsA("Frame")) {
						setMaxSize(parent.AbsoluteSize)
					}
				})
			)
		} else {
			// running in game
			const updateCamera = () => {
				if (!Workspace.CurrentCamera) return
				maid.GiveTask(
					Workspace.CurrentCamera?.GetPropertyChangedSignal("ViewportSize").Connect(() => {
						// game has been resized
						const camera = Workspace.CurrentCamera
						if (camera) {
							setMaxSize(camera.ViewportSize)
						}
					})
				)
			}

			maid.GiveTask(
				Workspace.GetPropertyChangedSignal("CurrentCamera").Connect(() => updateCamera())
			)
			updateCamera()
		}

		return () => {
			maid.DoCleaning()
		}
	}, [])

	return (
		<frame
			Key="main_menu"
			Ref={ref}
			// LayoutOrder={-1}
			Size={max_size.map((size) => {
				const x_offset = math.min(size.X * 0.33, 230)
				return new UDim2(0, x_offset, 1, 0)
			})}
			Transparency={1}
			Change={{
				AbsoluteSize: (rbx) => props.onSizeChange?.(rbx.AbsoluteSize),
			}}
		>
			<LogoFrame visible={props.visible}>
				<MenuButton
					Text={"PLAY"}
					onClick={() => {
						store.dispatch({ type: START_GAME })
						store.dispatch({ type: SET_MENU, page: "play" })
					}}
				/>
				<MenuButton
					Text={"LEVEL SELECT"}
					onClick={() => {
						store.dispatch({ type: SET_MENU, page: "level select" })
					}}
				/>
				<MenuButton
					Text={"STATS"}
					onClick={() => {
						store.dispatch({ type: SET_MENU, page: "stats" })
					}}
				/>
				<MenuButton
					Text={"SETTINGS"}
					onClick={() => {
						store.dispatch({ type: SET_MENU, page: "settings" })
					}}
				/>
				<Spacer />
				<MenuButton
					Text={"UPDATES"}
					onClick={() => {
						store.dispatch({ type: SET_MENU, page: "updates" })
					}}
				/>
				<MenuButton
					Text={"CREDITS"}
					onClick={() => {
						store.dispatch({ type: SET_MENU, page: "credits" })
					}}
				/>
			</LogoFrame>
		</frame>
	)
})
export default MainMenuList

import Roact from "@rbxts/roact"
import { GameMenuStates } from "client/user-interface/game-menu/actions/types"
import { MainMenuStates } from "client/user-interface/main-menu/actions/types"
import { RoactBinding } from "client/user-interface/roact-binding"
import SpringMenuFrame from "../spring-menu-frame"
import MenuButton from "./menu-button"

const HEADER_SIZE = new UDim2(0.95, 0, 0, 75)
const ENTER_UDIM2 = new UDim2(0, 10, 0, 0)
const EXIT_UDIM2 = new UDim2(-1, -2, 0, 0)

const Spacer = () => {
	return (
		<frame Size={UDim2.fromScale(1, 1)} Transparency={1}>
			<uiaspectratioconstraint AspectRatio={13} />
		</frame>
	)
}

const menu_data: (MainMenuStates | "")[] = [
	"play",
	"level select",
	"stats",
	"settings",
	"",
	"updates",
	"credits",
]

interface Props {
	Position: UDim2
	Size: UDim2
	visible: boolean
	SizeChange?: (size: Vector2) => void
	setMenu: (menu: MainMenuStates) => void
	setGameMenu: (menu: GameMenuStates) => void
}
interface State {
	Hide?: Boolean
}

class MainMenuList extends Roact.PureComponent<Props, State> {
	private size_binding = new RoactBinding(new Vector2())
	private ref = Roact.createRef<Frame>()

	render(): Roact.Element | undefined {
		return (
			<frame
				Key="main_menu"
				Ref={this.ref}
				LayoutOrder={-1}
				Size={this.size_binding.map((size) => {
					const instance = this.ref.getValue()
					const parent = instance && instance.Parent
					if (parent?.IsA("Frame")) {
						const x = math.min(parent.AbsoluteSize.X * 0.33, 230)
						return new UDim2(0.00002, x, 1, 0).add(this.props.Position) // so that AbsoluteSize change event is called on X resize
					}
					return this.props.Size
				})}
				Transparency={1}
				Change={{
					AbsoluteSize: (rbx) => {
						this.size_binding.setValue(rbx.AbsoluteSize)
						if (this.props.SizeChange) {
							this.props.SizeChange(rbx.AbsoluteSize)
						}
					},
				}}
			>
				<SpringMenuFrame
					InPosition={ENTER_UDIM2}
					OutPosition={EXIT_UDIM2}
					Size={new UDim2(1, -10, 1, 0)}
					Hide={!this.props.visible}
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

							{menu_data.map((item) => {
								if (!item) return <Spacer />
								return (
									<MenuButton
										Text={item.upper()}
										onClick={() => {
											if (item === "play") this.props.setGameMenu("play")
											this.props.setMenu(item as MainMenuStates)
										}}
									/>
								)
							})}
						</frame>
					</frame>
				</SpringMenuFrame>
			</frame>
		)
	}
}

export default MainMenuList

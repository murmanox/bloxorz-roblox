import Roact from "@rbxts/roact"
import MenuBodyScrollingFrame from "client/components/menu-body-scrolling-frame"
import SpringMenuFrame from "client/components/spring-menu-frame"

const HEADER_SIZE = new UDim2(1, 0, 0, 75)
const SCROLLING_POSITION = UDim2.fromOffset(0, HEADER_SIZE.Y.Offset)
const ENTER_UDIM2 = UDim2.fromScale(0, 0)
const EXIT_UDIM2 = new UDim2(1, 2, 0, 0)

interface Props {
	HeaderText: string
	HeaderSize?: UDim2
	HorizontalAlignment?: Enum.HorizontalAlignment
	Size: UDim2 | Roact.Binding<UDim2>
	Hide: boolean
	[Roact.Children]?: Roact.Element
}

const MainMenuFrame: Roact.FunctionComponent<Props> = (props: Props): Roact.Element => {
	return (
		<SpringMenuFrame
			Key="credits_menu"
			InPosition={ENTER_UDIM2}
			OutPosition={EXIT_UDIM2}
			Size={props.Size}
			Hide={props.Hide}
		>
			<textlabel
				Key="Header"
				Text={props.HeaderText}
				Size={props.HeaderSize ?? HEADER_SIZE}
				BackgroundTransparency={1}
				Font="Code"
				TextColor3={new Color3(1, 1, 1)}
				TextScaled={true}
			/>
			<MenuBodyScrollingFrame Position={SCROLLING_POSITION}>
				<uilistlayout
					Padding={new UDim(0, 30)}
					HorizontalAlignment={props.HorizontalAlignment ?? Enum.HorizontalAlignment.Center}
					SortOrder={Enum.SortOrder.LayoutOrder}
				/>
				{props[Roact.Children]}
			</MenuBodyScrollingFrame>
		</SpringMenuFrame>
	)
}

export default MainMenuFrame

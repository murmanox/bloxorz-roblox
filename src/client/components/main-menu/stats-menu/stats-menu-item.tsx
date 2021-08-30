import Roact from "@rbxts/roact"
import TextPadding from "client/components/text-padding"

export type StatItem = { name: string; value: number; format?: (input: number) => string }

interface StatsMenuItemProps {
	ItemData: StatItem
}

const StatsMenuItem = (props: StatsMenuItemProps): Roact.Element => {
	return (
		<frame Size={new UDim2(1, 0, 0, 40)} Transparency={1}>
			<textlabel
				Key="stat_name"
				Size={new UDim2(0.7, -5, 1, 0)}
				Text={props.ItemData.name}
				Font={Enum.Font.Code}
				TextXAlignment={Enum.TextXAlignment.Left}
				TextScaled={true}
				TextColor3={new Color3(1, 1, 1)}
				BorderSizePixel={0}
				BackgroundTransparency={0.75}
				BackgroundColor3={new Color3()}
			>
				<TextPadding PaddingLeft={new UDim(0, 15)} />
			</textlabel>
			<textlabel
				Key="stat_value"
				Size={UDim2.fromScale(0.3, 1)}
				AnchorPoint={new Vector2(1, 0)}
				Position={UDim2.fromScale(1, 0)}
				Text={props.ItemData.format && props.ItemData.format(props.ItemData.value)}
				Font={Enum.Font.Code}
				TextXAlignment={Enum.TextXAlignment.Right}
				TextScaled={true}
				TextColor3={new Color3(1, 1, 1)}
				BorderSizePixel={0}
				BackgroundTransparency={0.75}
				BackgroundColor3={new Color3()}
			>
				<TextPadding PaddingRight={new UDim(0, 15)} PaddingLeft={new UDim(0, 10)} />
			</textlabel>
		</frame>
	)
}

export default StatsMenuItem

import Roact from "@rbxts/roact"
import TextPadding from "client/components/text-padding"
import ScalingFrame from "../scaling-frame"
import StatsMenuItem, { StatItem } from "./stats-menu-item"

export interface StatCategory {
	name: string
	data: StatItem[]
}

interface StatsMenuCategoryProps {
	Category: StatCategory
}

const StatsMenuCategory = (props: StatsMenuCategoryProps): Roact.Element => {
	return (
		<ScalingFrame>
			<textlabel
				Text={`${props.Category.name}`}
				TextScaled={true}
				Font={Enum.Font.Code}
				TextColor3={new Color3(1, 1, 1)}
				Size={new UDim2(1, 0, 0, 50)}
				BorderSizePixel={0}
				BackgroundTransparency={0.75}
				BackgroundColor3={new Color3()}
			>
				<TextPadding />
			</textlabel>
			<uilistlayout />
			{props.Category.data.map((item) => (
				<StatsMenuItem ItemData={item} />
			))}
		</ScalingFrame>
	)
}

export default StatsMenuCategory

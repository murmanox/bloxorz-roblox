import Roact from "@rbxts/roact"
import ScaledWrappedTextLabel from "client/user-interface/common/components/scaled-wrapped-textlabel"
import { ui_config } from "shared/config/credits-config"
import MainMenuFrame from "./main-menu-frame"

interface CreditsMenuProps {
	Hide: boolean
}

// this should be stateful
const CreditsMenu = (props: CreditsMenuProps): Roact.Element => {
	return (
		<MainMenuFrame HeaderText="CREDITS" Size={new UDim2(1, -10, 1, 0)} Hide={props.Hide}>
			<ScaledWrappedTextLabel
				LayoutOrder={0}
				Text={ui_config.intro}
				TextColor3={new Color3(1, 1, 1)}
				BackgroundTransparency={1}
				FontSize={Enum.FontSize.Size28}
				Font={Enum.Font.Code}
			/>

			<imagelabel
				LayoutOrder={1}
				Image={ui_config.credit_image.image}
				Size={UDim2.fromScale(0.8, 1)}
				ScaleType={Enum.ScaleType.Fit}
				BackgroundTransparency={1}
			>
				<frame
					LayoutOrder={1}
					Size={new UDim2(1, 8, 1, 8)}
					BackgroundTransparency={1}
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={UDim2.fromScale(0.5, 0.5)}
				>
					<uistroke Thickness={2} />
				</frame>
				<uiaspectratioconstraint AspectRatio={ui_config.credit_image.aspect_ratio} />
			</imagelabel>

			<ScaledWrappedTextLabel
				LayoutOrder={2}
				Text={ui_config.long}
				TextColor3={new Color3(1, 1, 1)}
				BackgroundTransparency={1}
				FontSize={Enum.FontSize.Size28}
				Font={Enum.Font.Code}
			/>
		</MainMenuFrame>
	)
}

export default CreditsMenu

import Roact from "@rbxts/roact"
import MainMenuFrame from "./main-menu-frame"

interface Props {
	Hide: boolean
}

const UpdatesMenu = (props: Props): Roact.Element => {
	return (
		<MainMenuFrame HeaderText="UPDATES" Size={new UDim2(1, -10, 1, 0)} Hide={props.Hide}>
			<textlabel
				Text={"NOTHING HERE :)"}
				Size={new UDim2(0.9, 0, 0, 100)}
				TextColor3={new Color3(1, 1, 1)}
				BackgroundTransparency={1}
				Font={Enum.Font.Code}
				TextScaled={true}
			/>
		</MainMenuFrame>
	)
}

export default UpdatesMenu

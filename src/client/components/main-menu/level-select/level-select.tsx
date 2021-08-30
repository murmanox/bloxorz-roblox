import Roact from "@rbxts/roact"
import LevelGrid, { UILevelData } from "./level-grid"
import MainMenuFrame from "client/user-interface/main-menu/components/main-menu-frame"

interface LevelSelectProps {
	Levels: UILevelData[]
	Hide: boolean
}

const LevelSelect = (props: LevelSelectProps): Roact.Element => {
	return (
		<MainMenuFrame HeaderText="LEVEL SELECT" Size={UDim2.fromScale(1, 1)} Hide={props.Hide}>
			<LevelGrid Levels={props.Levels} />
		</MainMenuFrame>
	)
}

export default LevelSelect

import Roact from "@rbxts/roact"
import LevelGrid, { UILevelData } from "./level-grid"
import MainMenuFrame from "client/user-interface/components/main-menu/components/main-menu-frame"
import levels from "shared/config/levels"

const level_data: UILevelData[] = levels.map((level) => {
	return { name: level.name, unlocked: true, score: math.random(0, 3), image: level.image }
})

interface LevelSelectProps {
	Hide: boolean
}

const LevelSelect = (props: LevelSelectProps): Roact.Element => {
	return (
		<MainMenuFrame HeaderText="LEVEL SELECT" Size={new UDim2(1, -10, 1, 0)} Hide={props.Hide}>
			<LevelGrid Levels={level_data} />
		</MainMenuFrame>
	)
}

export default LevelSelect

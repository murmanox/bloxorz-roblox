import Roact from "@rbxts/roact"
import { RoactBinding } from "client/user-interface/roact-binding"
import LevelButton from "./level-button"

export interface UILevelData {
	name: string
	unlocked: boolean
	score: number
	image: string
}

const GRID_MAX_SIZE = 180 // pixels

interface Props {
	Levels: UILevelData[]
}

interface State {}

// TODO: Connect to store for player level data
class LevelGrid extends Roact.PureComponent<Props, State> {
	private absolute_size = new RoactBinding(new Vector2())

	render(): Roact.Element | undefined {
		return (
			<frame
				Size={new UDim2(1, 0, 1, 0)}
				BackgroundTransparency={1}
				BorderSizePixel={0}
				ClipsDescendants={true}
				AutomaticSize={Enum.AutomaticSize.Y}
				Change={{
					AbsoluteSize: (rbx) => this.absolute_size.setValue(rbx.AbsoluteSize),
				}}
			>
				<uigridlayout
					CellPadding={UDim2.fromOffset(20, 20)}
					CellSize={this.absolute_size.map((size) => {
						const x = math.ceil(size.X / GRID_MAX_SIZE)
						return new UDim2(1 / x, -20, 1, 0)
					})}
					SortOrder="LayoutOrder"
				>
					<uiaspectratioconstraint AspectRatio={1} />
				</uigridlayout>
				<uipadding
					PaddingLeft={new UDim(0, 20)}
					PaddingBottom={new UDim(0, 20)}
					PaddingTop={new UDim(0, 20)}
				/>
				{this.props.Levels.map((level, i) => (
					<LevelButton LevelData={level} LayoutOrder={i} />
				))}
			</frame>
		)
	}
}
export default LevelGrid

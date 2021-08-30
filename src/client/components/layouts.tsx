import Roact from "@rbxts/roact"

export namespace Layouts {
	// TODO scaled padding ..?
	interface GridLayoutProps {
		ItemsPerRow: number
		Padding: number
		[Roact.Children]?: Roact.Children
	}

	export const HorizontalGridLayout = (props: GridLayoutProps) => {
		return (
			<uigridlayout
				CellPadding={UDim2.fromOffset(props.Padding, props.Padding)}
				CellSize={new UDim2(1 / props.ItemsPerRow, -props.Padding, 1, 0)}
				SortOrder="LayoutOrder"
			>
				{props[Roact.Children]}
			</uigridlayout>
		)
	}
}

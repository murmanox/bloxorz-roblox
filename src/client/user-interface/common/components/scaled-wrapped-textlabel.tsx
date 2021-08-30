import Roact from "@rbxts/roact"
import { TextService } from "@rbxts/services"
import { RoactBinding } from "client/user-interface/roact-binding"

// just messing around with types
// type Props = Roact.JsxInstance<TextLabel> {}
type t = Exclude<keyof Roact.JsxInstance<TextLabel>, "Size" | "TextWrapped">
type y = { [K in t]?: Roact.JsxInstance<TextLabel>[K] }

type Props = y
interface State {}

class ScaledWrappedTextLabel extends Roact.PureComponent<Props, State> {
	private height_px = new RoactBinding(0)

	public render(): Roact.Element | undefined {
		return (
			<textlabel
				{...this.props}
				Size={this.height_px.map((height) => new UDim2(1, 0, 0, height))}
				TextWrapped={true}
				Change={{
					AbsoluteSize: (rbx) => {
						const bounds = TextService.GetTextSize(
							rbx.Text,
							rbx.TextSize,
							rbx.Font,
							new Vector2(rbx.AbsoluteSize.X, math.huge)
						)
						this.height_px.setValue(bounds.Y)
					},
				}}
			/>
		)
	}
}

export default ScaledWrappedTextLabel

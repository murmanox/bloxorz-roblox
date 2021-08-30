import Roact from "@rbxts/roact"
import { FontContext } from "../context"

type Props = Roact.JsxInstance<TextLabel>

const ThemedTextLabel = (props: Props): Roact.Element => {
	// {...props} also passes the children to the textlabel
	return <FontContext.Consumer render={(font_info) => <textlabel {...props} {...font_info} />} />
}

export default ThemedTextLabel

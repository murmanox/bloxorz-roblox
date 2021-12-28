import Roact from "@rbxts/roact"
import { hooked, useContext } from "@rbxts/roact-hooked"
import { FontContext } from "../../context/font-context"

type Props = Roact.JsxInstance<TextLabel>

const ThemedTextLabel = hooked<Props>((props: Props) => {
	const context = useContext(FontContext)
	return <textlabel {...props} {...context} />
})

export default ThemedTextLabel

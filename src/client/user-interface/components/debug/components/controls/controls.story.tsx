import Roact, { mount, unmount } from "@rbxts/roact"
import DebugControls from "."

export = (story: GuiObject) => {
	const handle = mount(<DebugControls />, story)

	return () => {
		unmount(handle)
	}
}

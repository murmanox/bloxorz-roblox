import Roact, { Children } from "@rbxts/roact"
import { hooked } from "@rbxts/roact-hooked"

const context_value = {
	Font: Enum.Font.Code,
	TextColor3: new Color3(1, 1, 1),
}

export const FontContext = Roact.createContext(context_value)

export const FontProvider = hooked((props) => {
	return <FontContext.Provider value={context_value}>{props[Children]}</FontContext.Provider>
})

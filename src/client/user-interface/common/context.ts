import Roact from "@rbxts/roact"

export const FontContext = Roact.createContext({
	Font: Enum.Font.Code,
	TextColor3: new Color3(1, 1, 1),
})

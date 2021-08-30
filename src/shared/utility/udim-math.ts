import Roact from "@rbxts/roact"

export namespace UDimMath {
	export function toValue(udim: UDim, scalar: number): number {
		return udim.Scale * scalar + udim.Offset
	}

	export function getUDim2Value(value: UDim2 | Roact.Binding<UDim2>): UDim2 {
		if (typeIs(value, "UDim2")) {
			return value
		}
		return value.getValue()
	}
}

import Roact from "@rbxts/roact"

interface TextPaddingProps {
	PaddingTop?: UDim
	PaddingBottom?: UDim
	PaddingLeft?: UDim
	PaddingRight?: UDim
}

const TextPadding = (props: TextPaddingProps) => (
	<uipadding
		PaddingBottom={props.PaddingBottom || new UDim(0, 4)}
		PaddingTop={props.PaddingTop || new UDim(0, 4)}
		PaddingLeft={props.PaddingLeft || new UDim(0, 4)}
		PaddingRight={props.PaddingRight || new UDim(0, 4)}
	/>
)

export default TextPadding

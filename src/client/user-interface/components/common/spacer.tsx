import Roact from "@rbxts/roact"

const Spacer = () => {
	return (
		<frame Size={UDim2.fromScale(1, 1)} Transparency={1}>
			<uiaspectratioconstraint AspectRatio={13} />
		</frame>
	)
}

export default Spacer

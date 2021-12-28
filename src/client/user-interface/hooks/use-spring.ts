import { SingleMotor } from "@rbxts/flipper"
import { useBinding, useEffect, useMutable } from "@rbxts/roact-hooked"

const useSpring = (target: number) => {
	const motor = useMutable(new SingleMotor(target)).current
	const [progress, setProgress] = useBinding(motor.getValue())

	useEffect(() => {
		motor.onStep(setProgress)
		return () => {
			motor.destroy()
		}
	}, [])

	return [progress, motor] as const
}

export default useSpring

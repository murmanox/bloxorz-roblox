import { useEffect } from "@rbxts/roact-hooked"
import { RunService } from "@rbxts/services"

const useRenderStepped = (callback: (delta_time: number, elapsed_time: number) => void) => {
	useEffect(() => {
		let elapsed = 0
		const connection = RunService.RenderStepped.Connect((dt) => {
			elapsed += dt
			callback(dt, elapsed)
		})
		return () => {
			connection.Disconnect()
		}
	}, [])
}

export default useRenderStepped

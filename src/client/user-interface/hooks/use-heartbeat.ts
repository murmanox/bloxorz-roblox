import { useEffect } from "@rbxts/roact-hooked"
import { RunService } from "@rbxts/services"

const useHeartbeat = (callback: (dt: number) => void) => {
	useEffect(() => {
		const connection = RunService.Heartbeat.Connect(callback)
		return () => {
			connection.Disconnect()
		}
	}, [])
}

export default useHeartbeat

import Maid from "@rbxts/maid"
import { useEffect } from "@rbxts/roact-hooked"
import { UserInputService } from "@rbxts/services"

const useInput = (callback: (input: InputObject, gameProcessedEvent: boolean) => void) => {
	useEffect(() => {
		const maid = new Maid()
		maid.GiveTask(UserInputService.InputBegan.Connect(callback))
		maid.GiveTask(UserInputService.InputChanged.Connect(callback))
		maid.GiveTask(UserInputService.InputEnded.Connect(callback))
		return () => {
			maid.DoCleaning()
		}
	}, [])
}

export default useInput

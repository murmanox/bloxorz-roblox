import Maid from "@rbxts/maid"
import { useEffect } from "@rbxts/roact-hooked"
import { UserInputService } from "@rbxts/services"

const useKeyboard = (callback: (input: InputObject, gameProcessedEvent: boolean) => void) => {
	useEffect(() => {
		const maid = new Maid()
		const onInput = (input: InputObject, gameProcessedEvent: boolean) => {
			if (input.UserInputType === Enum.UserInputType.Keyboard) {
				callback(input, gameProcessedEvent)
			}
		}

		maid.GiveTask(UserInputService.InputBegan.Connect(onInput))
		maid.GiveTask(UserInputService.InputChanged.Connect(onInput))
		maid.GiveTask(UserInputService.InputEnded.Connect(onInput))
		return () => {
			maid.DoCleaning()
		}
	}, [])
}

export default useKeyboard

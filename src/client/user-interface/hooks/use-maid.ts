import Maid from "@rbxts/maid"
import { useMutable } from "@rbxts/roact-hooked"

function useMaid() {
	return useMutable(new Maid()).current
}

export default useMaid

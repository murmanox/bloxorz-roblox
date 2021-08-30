import { NetworkEvent, NetworkFunction } from "@rbxts/ts-remote"

export namespace PlayerEvents {
	export const Moved = new NetworkEvent<PlayerMove>("PlayerMove")
}

export namespace NetworkFunctions {
	export const getPlayerStats = new NetworkFunction<GetPlayerStats>("GetPlayerStats")
}

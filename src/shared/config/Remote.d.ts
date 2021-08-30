interface PlayerMove {
	onClientEvent: () => void
	onServerEvent: () => void
}

interface GetPlayerStats {
	onServerInvoke: () => PlayerStats
}

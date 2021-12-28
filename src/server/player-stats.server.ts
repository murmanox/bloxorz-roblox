import { Players, RunService } from "@rbxts/services"
import { NetworkFunctions, PlayerEvents } from "shared/config/network-events"
import { default_stats } from "shared/player/stats"

// this method may be a bit annoying later on since I'm not able to pass values from the
// server to the client easily. Maybe replace with ValueBase's?
const player_stats_map = new Map<Player, PlayerStats>()
function getPlayerStats(player: Player): PlayerStats {
	const player_stats = player_stats_map.get(player)
	return player_stats ? player_stats : { ...default_stats }
}

//TODO: Profile Service
// TODO: leaky bucket to prevent spamming remotes
function onPlayerMoved(player: Player) {
	const stats = getPlayerStats(player)
	stats.total_moves += 1
}

function onPlayerDied(player: Player): void {
	const stats = getPlayerStats(player)
	stats.total_deaths += 1
}

function onPlayerTeleport(player: Player): void {
	const stats = getPlayerStats(player)
	stats.total_teleports += 1
}

function onPlayerButtonPressed(player: Player): void {
	const stats = getPlayerStats(player)
	stats.total_buttons_pressed += 1
}

function onPlayerLevelFinished(player: Player): void {
	const stats = getPlayerStats(player)
	stats.total_levels_finished += 1
}

function onPlayerTileBroken(player: Player): void {
	const stats = getPlayerStats(player)
	stats.total_tiles_broken += 1
}

const player_time_map = new Map<Player, number>()
function increaseTimePlayed(player: Player, dt: number): void {
	const time_stat = player_time_map.get(player)
	if (time_stat === undefined) return // 0 is falsy so check undefined

	player_time_map.set(player, time_stat + dt)
	const floored_time = math.floor(time_stat)
	const new_floored_time = math.floor(time_stat + dt)

	if (new_floored_time > floored_time) {
		getPlayerStats(player).total_time_played = new_floored_time
	}
}

// replace this with spawn wait for performance?
RunService.Heartbeat.Connect((dt) => {
	for (const player of Players.GetPlayers()) {
		increaseTimePlayed(player, dt)
	}
})

function onPlayerAdded(player: Player) {
	// get data from datastore and merge with default stats async
	const stats = { ...default_stats }
	player_stats_map.set(player, stats)
	player_time_map.set(player, stats.total_time_played)
}

function onPlayerRemoving(player: Player) {
	// upload data to datastore async

	// delete player's cached data
	player_stats_map.delete(player)
}

function onGameClose() {
	for (const player of Players.GetPlayers()) {
		// possible this could fail due to datastore limits
		onPlayerRemoving(player)
	}
}

// init player events
Players.PlayerAdded.Connect(onPlayerAdded)
Players.PlayerRemoving.Connect(onPlayerRemoving)
game.BindToClose(onGameClose)

// init network events
PlayerEvents.Moved.onServerEvent.Connect(onPlayerMoved)
NetworkFunctions.getPlayerStats.onServerInvoke = getPlayerStats

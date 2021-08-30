import { Players } from "@rbxts/services"
import { NetworkFunctions } from "shared/config/network-events"
import { playerStatsToStatistics } from "shared/player/stats"

const player_gui = Players.LocalPlayer.WaitForChild("PlayerGui") as PlayerGui

const x = NetworkFunctions.getPlayerStats.invokeServer()
export const player_stats = playerStatsToStatistics(x)

// player_stats.total_moves.changed.Connect((value) => {
// 	player_gui.ScreenGui.game_gui.top_bar.moves.value.Text = tostring(value)
// })

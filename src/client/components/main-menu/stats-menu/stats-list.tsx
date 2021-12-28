import Roact from "@rbxts/roact"
import RoactRodux from "@rbxts/roact-rodux"
import StatsMenuCategory, { StatCategory } from "./stats-menu-category"
import { StatItem } from "./stats-menu-item"
import { String } from "shared/utility/string-utils"
import { PlayerStatsState } from "client/user-interface/store/stats/types"
import { AppState } from "client/user-interface/store"
import { hooked } from "@rbxts/roact-hooked"
import { useSelector } from "@rbxts/roact-rodux-hooked"
import inspect from "@rbxts/inspect"

interface StatInfo {
	name: string
	format: String.StringFormatter
	category: Category
}

interface CategoryInfo {
	display_text: string
	order: number
}

type Category = "gameplay" | "tiles" | "time"
type CategoryInfoMap = { [K in Category]: CategoryInfo }
const category_info_map: CategoryInfoMap = {
	time: { display_text: "TIME", order: 1 },
	gameplay: { display_text: "GAMEPLAY", order: 2 },
	tiles: { display_text: "TILES", order: 3 },
}

type StatInfoMap = { [K in keyof PlayerStatsState]: StatInfo }
const stat_map: StatInfoMap = {
	total_movement: { name: "Movements", format: String.formatNumber, category: "gameplay" },
	total_buttons_pressed: {
		name: "Buttons pressed",
		format: String.formatNumber,
		category: "tiles",
	},
	total_deaths: { name: "Deaths", format: String.formatNumber, category: "gameplay" },
	total_levels_finished: {
		name: "Levels Finished",
		format: String.formatNumber,
		category: "gameplay",
	},
	total_teleports: { name: "Teleports", format: String.formatNumber, category: "tiles" },
	total_tiles_broken: { name: "Tiles broken", format: String.formatNumber, category: "tiles" },
	total_time_played: {
		name: "Time spent playing",
		format: String.formatTime,
		category: "time",
	},
}

const mapStateToProps = (state: AppState) => {
	const stat_category_map = new Map<string, StatItem[]>()

	const stat_categories: StatCategory[] = []
	for (const [stat_name, stat_value] of pairs(state.stats)) {
		const stat_info = stat_map[stat_name]

		// Get the display name of the state and get its formatting function
		const data: StatItem = {
			name: stat_map[stat_name].name,
			value: stat_value,
			format: stat_map[stat_name].format,
		}

		// Create an array for each category and add the stat to its category's array
		const category = stat_category_map.get(stat_info.category)
		if (category) {
			category.push(data)
		} else {
			stat_category_map.set(stat_info.category, [data])
		}
	}

	for (const [category, stat_item] of stat_category_map) {
		// Order items within our category to be in alphabetical order
		const sorted_category_stats = stat_item.sort((a, b) => a.name.lower() < b.name.lower())
		stat_categories.push({
			name: category,
			data: sorted_category_stats,
		})
	}

	const props = stat_categories
		// Order our categories according to their order property
		.sort((a, b) => {
			const name_a = a.name as Category
			const name_b = b.name as Category
			return category_info_map[name_a].order < category_info_map[name_b].order
		})
		// Update the name property to match what's in the category_map
		.map((category) => {
			return { ...category, ...{ name: category_info_map[category.name as Category].display_text } }
		})

	return props
}

interface Props {}

const StatsList = hooked<Props>((props) => {
	const categories = useSelector((state: AppState) => mapStateToProps(state))

	return (
		<>
			{categories.map((category) => {
				return <StatsMenuCategory Category={category} />
			})}
		</>
	)
})

export default StatsList

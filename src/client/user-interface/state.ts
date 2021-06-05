import { Players, StarterGui } from "@rbxts/services"

const player_gui = Players.LocalPlayer.WaitForChild("PlayerGui") as PlayerGui
StarterGui.GetChildren().forEach((child) => {
	child.Clone().Parent = player_gui
})

const main_menu_gui = player_gui.ScreenGui.main_menu.main_menu
const level_select_gui = player_gui.ScreenGui.level_select
const stats_gui = player_gui.ScreenGui.main_menu.stats
const credits_gui = player_gui.ScreenGui.main_menu.credits
const settings_gui = player_gui.ScreenGui.main_menu.settings

interface IState {
	onEnter?: () => void
	onExit?: () => void
}

class State {
	public onEnter() {}
	public onExit() {}
}

interface InterfaceStates {
	main_menu: IState
	level_select: IState
	stats: IState
	settings: IState
}

interface MachineConfig<T> {
	initial: keyof T
	states: T
}

class Machine {
	// current_state: InterfaceStates[keyof InterfaceStates] | undefined
	current_state: keyof InterfaceStates
	default_state: keyof InterfaceStates

	states: InterfaceStates

	constructor(config: MachineConfig<InterfaceStates>) {
		this.states = config.states
		this.current_state = config.initial
		this.default_state = config.initial

		this.setState(config.initial)
	}

	public toggleState(state: keyof InterfaceStates) {
		if (state === this.current_state) {
			// go back to default state, or pop state?
			this.setState(this.default_state)
			return
		}

		this.setState(state)
	}

	public setState(state: keyof InterfaceStates) {
		const new_state = this.states[state]
		const current = this.states[this.current_state]

		if (current) {
			if (current.onExit) current.onExit()
		}

		if (new_state) {
			if (new_state.onEnter) new_state.onEnter()
			this.current_state = state
		}
	}
}

const MainMenu: IState = {
	onEnter: () => {},
	onExit: () => {},
}

const LevelSelect: IState = {
	onEnter: () => {
		level_select_gui.Visible = true
	},
	onExit: () => {
		level_select_gui.Visible = false
	},
}

const StatsMenu: IState = {
	onEnter: () => {
		stats_gui.Visible = true
	},
	onExit: () => {
		stats_gui.Visible = false
	},
}

const SettingsMenu: IState = {
	onEnter: () => {
		settings_gui.Visible = true
	},
	onExit: () => {
		settings_gui.Visible = false
	},
}

const machine = new Machine({
	initial: "main_menu",
	states: {
		main_menu: MainMenu,
		level_select: LevelSelect,
		stats: StatsMenu,
		settings: SettingsMenu,
	},
})

main_menu_gui.Frame.level_select.Activated.Connect(() => {
	machine.setState("level_select")
})

main_menu_gui.Frame.level_select.Activated.Connect(() => {
	machine.setState("level_select")
})

main_menu_gui.Frame.stats.Activated.Connect(() => {
	machine.toggleState("stats")
})

main_menu_gui.Frame.settings.Activated.Connect(() => {
	machine.toggleState("settings")
})

export const hello = 1

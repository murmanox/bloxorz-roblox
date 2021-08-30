import Roact from "@rbxts/roact"
import RoactRodux, { StoreProvider } from "@rbxts/roact-rodux"
import Rodux from "@rbxts/rodux"
import Signal from "shared/module/Signal"

namespace Actions {
	interface AddTimeAction extends Rodux.Action<"AddTimeToPlayer"> {
		seconds: number
	}
	export function addTime(seconds: number): AddTimeAction {
		return {
			type: "AddTimeToPlayer",
			seconds: seconds,
		}
	}

	export type StoreActions = AddTimeAction
}

namespace Components {
	interface TimerProps {
		value: number
		test: string
	}
	export const Clock = (props: TimerProps): Roact.Element => {
		const hours = math.floor(props.value / 3600)
		const minutes = math.floor((props.value % 3600) / 60)
		const seconds = math.floor((props.value % 3600) % 60)

		return (
			<textlabel
				Text={string.format("%d:%02d:%02d", hours, minutes, seconds)}
				TextScaled={true}
				Size={UDim2.fromOffset(250, 150)}
			/>
		)
	}
}

const initial_state: StoreState = {
	total_time_played: 0,
}

const reducer = Rodux.createReducer<StoreState, Actions.StoreActions>(initial_state, {
	AddTimeToPlayer: (state, action) => {
		state.total_time_played += action.seconds
		return { ...state }
	},
})

interface StoreState {
	total_time_played: number
}

const store = new Rodux.Store<StoreState, Actions.StoreActions>(reducer)

const mapStateToProps = (state: StoreState) => {
	return { value: state.total_time_played }
}

const Clock = RoactRodux.connect(mapStateToProps)(Components.Clock)

export = (preview_frame: GuiObject) => {
	let running = true

	const element = (
		<StoreProvider store={store}>
			<Clock test={"hello"} />
		</StoreProvider>
	)
	const handle = Roact.mount(element, preview_frame)

	spawn(() => {
		while (running) {
			// increment time here
			wait(1)
			if (running) store.dispatch(Actions.addTime(1))
		}
	})

	const signal = new Signal<(name: string, level: number) => void>()
	const connection = signal.connect((name, level) => print(`${name} is level ${level}`))
	signal.fire("murmanox", 11)

	delay(1, () => {
		signal.fire("murmanox", 12)
	})

	spawn(() => {
		print(...signal.wait())
		connection.disconnect()
	})

	return () => {
		running = false
		Roact.unmount(handle)
	}
}

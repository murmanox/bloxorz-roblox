import Maid from "@rbxts/maid"
import { TweenService, Workspace } from "@rbxts/services"

export class TweenPromise<T extends Instance> {
	private tween: Tween
	private will_play = false

	constructor(
		instance: T,
		tween_info: TweenInfo,
		properties: Partial<ExtractMembers<T, Tweenable>>
	) {
		this.tween = TweenService.Create(instance, tween_info, properties)
	}

	public play(): Promise<void> {
		return new Promise((resolve, reject, onCancel) => {
			if (this.isPlaying()) return reject("Tween is already playing")

			onCancel(() => this.tween.Cancel())

			const maid = new Maid()

			maid.GiveTask(
				this.tween.Completed.Connect((state) => {
					if (state === Enum.PlaybackState.Completed) {
						resolve()
					}
					maid.DoCleaning()
				})
			)

			maid.GiveTask(
				this.tween.GetPropertyChangedSignal("PlaybackState").Connect(() => {
					const state = this.tween.PlaybackState
					if (state === Enum.PlaybackState.Paused) {
						maid.DoCleaning()
					}
				})
			)

			this.tween.Play()
		})
	}

	public delay(time: number): Promise<any> {
		if (this.will_play) return Promise.reject("")
		this.will_play = true

		return Promise.delay(time)
			.then(() => this.play())
			.finally(() => (this.will_play = false))
	}

	public cancel() {
		this.tween.Cancel()
	}
	public pause() {
		this.tween.Pause()
	}

	public isPlaying(): boolean {
		return (
			this.tween.PlaybackState === Enum.PlaybackState.Playing ||
			this.tween.PlaybackState === Enum.PlaybackState.Delayed
		)
	}
}

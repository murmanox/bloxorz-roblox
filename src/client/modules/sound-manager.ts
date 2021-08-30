import Make from "@rbxts/make"
import { ContentProvider, Debris, ReplicatedStorage, SoundService } from "@rbxts/services"

class SoundFile {
	instance: Sound

	constructor(asset: Sound) {
		this.instance = asset
	}

	play() {
		const clone = this.instance.Clone()
		clone.Parent = SoundService
		clone.Play()

		if (!clone.Looped) {
			Debris.AddItem(clone, clone.TimeLength + 1)
		}
	}

	stop() {
		this.instance.Stop()
	}
}

const audio_assets = ReplicatedStorage.assets.audio
const sounds = {
	interface_mouse_over: new SoundFile(audio_assets.interface.button_mouse_over),
}

class SoundManager<T extends { [key: string]: SoundFile }> {
	sounds: T

	constructor(sounds: T) {
		this.sounds = sounds
	}

	play(sound: keyof T) {
		const sound_file = this.sounds[sound] as SoundFile
		if (sound_file) {
			sound_file.play()
		}
	}
}

export default new SoundManager(sounds)

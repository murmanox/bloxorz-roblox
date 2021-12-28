import { ContentProvider, Debris, ReplicatedStorage, SoundService } from "@rbxts/services"

// TODO: preload

type Modifiers = {
	PlaybackSpeed?: number
}

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

	// TODO: support sound effects
	applyModifiers(modifiers: Modifiers) {
		for (const [k, v] of pairs(modifiers)) {
			this.instance[k] = v
		}
	}
}

const audio_assets = ReplicatedStorage.assets.audio
const sounds = {
	interface_mouse_over: new SoundFile(audio_assets.interface.button_mouse_over),
	stone_impact: new SoundFile(audio_assets.stone_impact),
}

class SoundManager<T extends { [key: string]: SoundFile }> {
	sounds: T

	constructor(sounds: T) {
		this.sounds = sounds
	}

	play(sound: keyof T, modifiers?: Modifiers) {
		const sound_file = this.sounds[sound] as SoundFile
		if (modifiers) sound_file.applyModifiers(modifiers)
		if (sound_file) {
			sound_file.play()
		}
	}
}

export default new SoundManager(sounds)

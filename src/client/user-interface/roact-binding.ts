import Roact from "@rbxts/roact"

export class RoactBinding<T> {
	private readonly setter
	private readonly getter

	constructor(defaultValue: T) {
		const [getter, setter] = Roact.createBinding(defaultValue)
		this.getter = getter
		this.setter = setter
	}

	public getBinding() {
		return this.getter
	}

	public getValue(): T {
		return this.getter.getValue()
	}

	public setValue(data: T) {
		this.setter(data)
	}

	public map<U>(callback: (value: T) => U): Roact.Binding<U> {
		return this.getter.map(callback)
	}
}

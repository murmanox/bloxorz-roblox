export namespace Vector3Math {
	export function rotateX(v: Vector3, rad: number, pivot: Vector3 = v3.zero) {
		v = v.sub(pivot)
		const x = v.X
		const y = v.Y * math.cos(rad) - v.Z * math.sin(rad)
		const z = v.Y * math.sin(rad) + v.Z * math.cos(rad)

		return pivot.add(new Vector3(x, y, z))
	}

	export function rotateY(v: Vector3, rad: number, pivot: Vector3 = v3.zero) {
		v = v.sub(pivot)
		const x = v.X * math.cos(rad) + v.Z * math.sin(rad)
		const y = v.Y
		const z = v.X * -math.sin(rad) + v.Z * math.cos(rad)

		return pivot.add(new Vector3(x, y, z))
	}

	export function rotateZ(v: Vector3, rad: number, pivot: Vector3 = v3.zero) {
		v = v.sub(pivot)
		const x = v.X * math.cos(rad) - v.Y * math.sin(rad)
		const y = v.X * math.sin(rad) + v.Y * math.cos(rad)
		const z = v.Z

		return pivot.add(new Vector3(x, y, z))
	}

	export function rotateXYZ(v: Vector3, x = 0, y = 0, z = 0, pivot: Vector3 = v3.zero) {
		v = rotateX(v, x, pivot)
		v = rotateY(v, y, pivot)
		v = rotateZ(v, z, pivot)

		return v
	}
}

export namespace v3 {
	export const up = new Vector3(0, 1, 0)
	export const down = new Vector3(0, -1, 0)
	export const right = new Vector3(1, 0, 0)
	export const left = new Vector3(-1, 0, 0)
	export const forward = new Vector3(0, 0, 1)
	export const back = new Vector3(0, 0, -1)
	export const zero = new Vector3(0, 0, 0)
}
